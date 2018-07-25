class Game {
    constructor() {
        document.addEventListener('keyup', event => this.handleInput(event.keyCode));

        this.allLevels = [
            // new Level_1(),
            // new Level_2(),
            // new Level_3(),
            new Level_4()
            // new Level_5()
        ];
        this.currentLevel = this.allLevels[0];

        this.gameStateObjects = new Map([
            ['score', new ScoreText()],
            ['lvl', new LvlText()],
            ['heart', new HeartImage()],
            ['lives', new LivesText()],
            ['pauseMsg', new PauseBottomMessage()]
        ]);

        this.additionalRenderObjects = new Map();

        this.player = new Player();

        this.gameLost = false;
        this.gameWon = false;
        this.paused = false;

        this.initLevel();
    }

    resetGame() {
        this.allLevels.forEach(level => level.reset());
        this.currentLevel = this.allLevels[0];

        this.gameStateObjects.forEach(obj => obj.reset());
        this.additionalRenderObjects = new Map();

        this.player.reset();

        this.gameLost = false;
        this.gameWon = false;
        this.paused = false;
    }

    initLevel() {
        let lvl = this.gameStateObjects.get('lvl').lvl;
        this.currentLevel = this.allLevels[lvl - 1];

        if (this.currentLevel.isWaterLevel()) {
            this.player.setAnimation(new MoveUpDownAnimation(20, -10, 10));
        } else {
            this.player.setAnimation(null);
        }

        this.player.setPositionOnBoard(5, 2);
    }

    /**
     * Update game objects positions
     *
     * @param dt
     */
    update(dt) {
        this.currentLevel.update(dt);

        this.gameStateObjects.forEach(obj => obj.update(dt));
        this.additionalRenderObjects.forEach(obj => obj.update(dt));

        this.player.update(dt);

        if (this.currentLevel.collideWithEnemy(this.player.rect) &&
            (!this.paused && !this.gameLost && !this.gameWon)) {
            this.looseLife();
        }
    }

    /**
     * First draw all game objects.
     * And if the game is won or lost, then show showWinDialog/showLooseDialog dialog
     */
    render() {
        this.currentLevel.render();

        this.gameStateObjects.forEach(obj => obj.render());
        this.additionalRenderObjects.forEach(obj => obj.render());

        this.player.render();

        this.currentLevel.renderForeground();

        if (this.gameWon) {
            this.showWinDialog();
        } else if (this.gameLost) {
            this.showLooseDialog();
        }
    }

    showWinDialog() {
        this.setPause(true);
        engine.showDialog('You Did It!', 'Press \'Enter\' to Play Again');
    }

    showLooseDialog() {
        this.setPause(true);
        engine.showDialog('Game Over!', 'Press \'Enter\' to Play Again');
    }

    winLevel() {
        this.gameStateObjects.get('score').addScore(500);

        let lvl = this.gameStateObjects.get('lvl').lvl;
        if ((lvl + 1) > this.allLevels.length) {
            this.gameWon = true;
        } else {
            this.gameStateObjects.get('lvl').increaseLvl();
            this.initLevel();
        }
    }

    /**
     * Loose life.
     * Change image.
     * Set pause for 0.2 sec.
     * After timeout resetGame to default state
     */
    looseLife() {
        this.player.setImage(this.player.imageSad);
        const lives = this.gameStateObjects.get('lives');
        lives.setStrokeColor(lives.colorYellow);
        lives.looseLife();
        game.setPause(true);

        setTimeout(() => {
            this.player.setImage(this.player.imageNormal);
            lives.setStrokeColor(lives.colorWhite);
            if (lives.lives <= 0) {
                this.gameLost = true;
            } else {
                this.player.setPositionOnBoard(5, 2);
            }
            game.setPause(false);
        }, 400);
    }

    /**
     * Set paused on/off
     */
    setPause(pause) {
        this.paused = pause;
        this.paused ? engine.stop() : engine.start();
    }

    showBonusText(text, x, y) {
        const bonusTextObj = new RenderedText(text, x, y, {font: 'bold 18px Arial', fillStyle: '#321156', textAlign: 'center'});
        bonusTextObj.setAnimation(new MoveUpAnimation());
        this.additionalRenderObjects.set('bonusText', bonusTextObj);

        setTimeout(() => {
            this.additionalRenderObjects.delete('bonusText');
        }, 400);
    }

    showScroll(x, y) {
        const scroll = new RenderedImage('img/scroll.png', x, y);
        this.additionalRenderObjects.set('scroll', scroll);

        setTimeout(() => {

            let fadeOutTime = 1000;
            scroll.setAnimation(new FadeOutAnimation(fadeOutTime));
            setTimeout(() => {
                this.additionalRenderObjects.delete('scroll');
            }, fadeOutTime);

        }, 3000);
    }

    /**
     * Handle keyboard input.
     *
     * @param keyCode
     */
    handleInput(keyCode) {
        const allowedKeys = {
            80: 'pause',
            13: 'enter'
        };

        switch (allowedKeys[keyCode]) {
            case 'pause':
                if (!this.gameLost && !this.gameWon) {
                    this.setPause(!this.paused);
                    engine.showDialog('Pause', 'Press \'p\' to resume');
                }
                break;
            case 'enter':
                if (this.gameLost || this.gameWon) {
                    this.resetGame();
                    engine.start();
                }
                break;
            default:
                if (!this.paused && !this.gameLost && !this.gameWon) {
                    this.handlePlayerInput(keyCode);
                }
        }
    }

    handlePlayerInput(keyCode) {
        const allowedKeys = {
            37: 'x',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        // remove any messages if user does not want to read them
        if (this.additionalRenderObjects.has('msg')) {
            this.additionalRenderObjects.delete('msg');
        }

        let row = this.player.row;
        let col = this.player.col;

        switch (allowedKeys[keyCode]) {
            case 'x':
                if ((col - 1 >= 0) && this.currentLevel.canPass(row, col - 1)) {
                    this.player.col--;
                }
                break;
            case 'right':
                if ((col + 1 <= 4) && this.currentLevel.canPass(row, col + 1)) {
                    this.player.col++;
                }
                break;
            case 'up':
                if ((row - 1 >= 0) && this.currentLevel.canPass(row - 1, col)) {
                    this.player.row--;
                }
                if (this.player.row === 0 && this.currentLevel.canWinLevel()) {
                    this.winLevel();
                }
                break;
            case 'down':
                if ((row + 1 <= 5) && this.currentLevel.canPass(row + 1, col)) {
                    this.player.row++;
                }
                break;
        }

        this.player.setPositionOnBoard(this.player.row, this.player.col);
        this.player.update(0);

        if (this.currentLevel.canCollectItem(this.player.row, this.player.col)) {
            let bonus = this.currentLevel.collectItem(this.player.row, this.player.col);
            this.gameStateObjects.get('score').addScore(bonus.bonusScore);
            this.gameStateObjects.get('lives').addLives(bonus.bonusLives);

            this.showBonusText(bonus.getBonusText(), this.player.rect.centerX, this.player.rect.y);

            if (bonus instanceof ScrollBonus) {
                this.showScroll(this.player.rect.right + 10, this.player.rect.y - this.player.rect.height);
            }
        }
    }
}

// todo
// choose player

// bugs jump
// gem glows
// heartbeat

// player water foreground

// player underwater fall
// player underwater bubbles
// underwater chars
// msg
// animated text

// seagull animation with interpolation
// all happy
// flying hearts

// unfinished: levels, reset, game stats precise positions
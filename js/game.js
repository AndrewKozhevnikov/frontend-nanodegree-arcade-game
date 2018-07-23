class Game {
    constructor() {
        // this.allLevels = [
        //     new Level_1(this),
        //     new Level_2(this),
        //     new Level_3(this),
        //     new Level_4(this)
        // ];

        this.allLevels = [
            new Level_5(this)
        ];

        this.player = new Player(0.6);
        document.addEventListener('keyup', event => this.handleInput(event.keyCode));
        this.reset();

        this.renderObjects = [];
        // staticRenderObjects or gameStateObjects
    }

    reset() {
        this.allLevels.forEach(level => level.reset());

        this.lvl = 1;
        this.currentLevel = this.allLevels[this.lvl - 1];

        this.score = 0;
        this.gameLost = false;
        this.gameWon = false;
        this.paused = false;

        this.player.reset();

        // todo remove
        this.messages = [];
    }

    resetPositions() {
        this.currentLevel.resetPositions();
        this.player.resetPosition();
    }

    /**
     * First draw all game objects.
     * And if the game is won or lost, then show win/loose dialog
     */
    render() {
        this.currentLevel.render();
        this.player.render();

        this.renderScore();
        this.renderLvlText();
        this.renderHealthBar();
        this.renderBottomMessage();

        this.renderAdditionalObjects();

        if (this.gameLost) {
            this.loose();
        } else if (this.gameWon) {
            this.win();
        }
    }

    renderScore() {
        engine.strokeAndFillText('Score: ' + this.score, 20, 90,
            {font: 'bold 24px Arial', fillStyle: '#FEFC36', strokeStyle: '#000000'});
    }

    renderLvlText() {
        engine.strokeAndFillText('Lvl: ' + this.lvl, engine.canvas.width - 20, 90,
            {font: 'bold 24px Arial', fillStyle: '#FEFC36', strokeStyle: '#000000', textAlign: 'right'});
    }

    renderHealthBar() {
        let strokeColor = this.player.livesTextStrokeColor;
        ctx.drawImage(res.get('img/heart_mini.png'), 20, engine.canvas.height - 68);
        engine.strokeAndFillText('x ' + this.player.lives, 60, engine.canvas.height - 45,
            {fillStyle: '#000000', strokeStyle: strokeColor, lineWidth: 4});
    }

    renderBottomMessage() {
        engine.fillText('Press \'p\' to pause or resume', engine.canvas.width - 10, engine.canvas.height - 45,
            {font: '18px Arial', fillStyle: '#FFFFFF', textAlign: 'right'});
    }

    renderAdditionalObjects() {
        this.renderObjects.forEach(obj => obj.render());
    }

    addRenderObject(obj) {
        this.renderObjects.push(obj);
    }

    removeRenderObject(obj) {
        this.renderObjects.remove(obj);
    }

    showBonusText(text, x, y, {font = 'bold 18px Arial', fillStyle = '#321156', textAlign = 'center'} = {}) {
        const bonusTextObj = new RenderText(text, x, y, {font, fillStyle, textAlign});
        bonusTextObj.setAnimation(new SlideUpAnimation());
        this.addRenderObject(bonusTextObj);

        setTimeout(() => {
            this.removeRenderObject(bonusTextObj);
        }, 400);
    }

    showScroll(x, y) {
        const scroll = new RenderImage('img/scroll.png', x, y);
        this.addRenderObject(scroll);
        this.messages.push(scroll);

        setTimeout(() => {

            let fadeOutTime = 1000;
            scroll.setAnimation(new FadeOutAnimation(fadeOutTime));
            setTimeout(() => {
                this.messages.remove(scroll);
                this.removeRenderObject(scroll);
            }, fadeOutTime);

        }, 3000);
    }

    /**
     * Update game objects positions
     *
     * @param dt
     */
    update(dt) {
        this.currentLevel.update(dt);
        this.player.update(dt);

        this.updateAdditionalObjects(dt);

        if (this.currentLevel.collideWithEnemy(this.player.rect) &&
            (!this.paused && !this.gameLost && !this.gameWon)) {
            this.player.looseLife();
        }
    }

    updateAdditionalObjects(dt) {
        this.renderObjects.forEach(obj => obj.update(dt));
    }

    winLevel() {
        this.score += 500;

        if ((this.lvl + 1) > this.allLevels.length) {
            this.gameWon = true;
        } else {
            this.lvl++;
            this.currentLevel = this.allLevels[this.lvl - 1];

            if (this.currentLevel.isWaterLevel()) {
                let animation = new SlideUpDownAnimation(-10, 10, 20);
                this.player.setAnimation(animation);
            } else {
                this.player.setAnimation(null);
            }

            this.resetPositions();
        }
    }

    win() {
        this.setPause(true);
        engine.showDialog('You Did It!', 'Press \'Enter\' to Play Again');
    }

    loose() {
        this.setPause(true);
        engine.showDialog('Game Over!', 'Press \'Enter\' to Play Again');
    }

    /**
     * Set paused on/off
     */
    setPause(pause) {
        this.paused = pause;
        this.paused ? engine.stop() : engine.start();
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
                    this.reset();
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
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        // todo refactor names and both arrays
        if (this.messages.length > 0) {
            this.removeRenderObject(this.messages.pop());
        }

        let row = this.player.row;
        let col = this.player.col;

        switch (allowedKeys[keyCode]) {
            case 'left':
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

        if (this.currentLevel.canCollectItem(this.player.row, this.player.col)) {
            let bonus = this.currentLevel.collectItem(this.player.row, this.player.col);
            this.score += bonus.bonusScore;
            this.player.lives += bonus.bonusLives;

            let rect = this.player.getUpdatedRect();
            this.showBonusText(bonus.getBonusText(), rect.centerX, rect.top);

            if (bonus instanceof ScrollBonus) {
                this.showScroll(rect.right + 10, rect.top - rect.height);
            }
        }
    }
}

// todo bugs jump
// gem glows
// heartbeat
// player water foreground
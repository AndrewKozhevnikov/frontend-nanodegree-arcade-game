class Game {
    constructor() {
        this.allLevels = [new Level_1(this), new Level_2(this)];
        this.player = new Player(this, 0.6);
        document.addEventListener('keyup', event => this.handleInput(event.keyCode));
        this.reset();
    }

    setEngine(engine) {
        this.engine = engine;
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
        this.engine.strokeAndFillText('Score: ' + this.score, 20, 90,
            {font: 'bold 24px Arial', fillStyle: '#FEFC36', strokeStyle: '#000000'});
    }

    renderLvlText() {
        this.engine.strokeAndFillText('Lvl: ' + this.lvl, this.engine.canvas.width - 20, 90,
            {font: 'bold 24px Arial', fillStyle: '#FEFC36', strokeStyle: '#000000', textAlign: 'right'});
    }

    renderHealthBar() {
        let strokeColor = this.player.livesTextStrokeColor;
        this.engine.ctx.drawImage(res.get('img/heart_mini.png'), 20, this.engine.canvas.height - 68);
        this.engine.strokeAndFillText('x ' + this.player.lives, 60, this.engine.canvas.height - 45,
            {fillStyle: '#000000', strokeStyle: strokeColor, lineWidth: 4});
    }

    renderBottomMessage() {
        this.engine.fillText('Press \'p\' to pause or resume', this.engine.canvas.width - 10, this.engine.canvas.height - 45,
            {font: '18px Arial', fillStyle: '#FFFFFF', textAlign: 'right'});
    }

    renderAdditionalObjects() {
        this.renderedObjects.forEach(obj => obj.render());
    }

    addRenderedObject(obj) {
        this.renderedObjects.push(obj);
    }

    removeRenderedObject(obj) {
        let index = this.renderedObjects.indexOf(obj);
        if (index !== -1) this.renderedObjects.splice(index, 1);
    }

    showFloatingText(text, x, y, {font = '24px Arial', fillStyle = '#000000', textAlign = 'left'} = {}) {
        const obj = new RenderedText(this, text, x, y, {font, fillStyle, textAlign});
        this.addRenderedObject(obj);

        setTimeout(() => {
            this.removeRenderedObject(obj);
        }, 5000);
    }

    /**
     * Update game objects positions
     *
     * @param dt
     */
    update(dt) {
        this.currentLevel.update(dt);
        this.player.update(dt);

        if (this.currentLevel.collideWithEnemy(this.player.rect) &&
            (!this.paused && !this.gameLost && !this.gameWon)) {
            this.player.looseLife();
        }
    }

    winLevel() {
        this.score += 500;

        if ((this.lvl + 1) > this.allLevels.length) {
            this.gameWon = true;
        } else {
            this.lvl++;
            this.currentLevel = this.allLevels[this.lvl - 1];
            this.resetPositions();
        }
    }

    win() {
        this.setPause(true);
        this.engine.showDialog('You Did It!', 'Press \'Enter\' to Play Again');
    }

    loose() {
        this.setPause(true);
        this.engine.showDialog('Game Over!', 'Press \'Enter\' to Play Again');
    }

    /**
     * Set paused on/off
     */
    setPause(pause) {
        this.paused = pause;
        this.paused ? this.engine.stop() : this.engine.start();
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
                    this.engine.showDialog('Pause', 'Press \'p\' to resume');
                }
                break;
            case 'enter':
                if (this.gameLost || this.gameWon) {
                    this.reset();
                    this.engine.start();
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
                if (this.player.row === 0) this.winLevel(); // todo change to level's method
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
            this.engine.showFloatingText(bonus.getBonusText(), this.player.rect.left, this.player.rect.top);
        }
    }
}
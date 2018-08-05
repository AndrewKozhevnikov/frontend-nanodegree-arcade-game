class Game {
    constructor() {
        document.addEventListener('keyup', event => this.handleKeyboardInput(event.keyCode));

        // define constants
        this.STATE_NORMAL = 'STATE_NORMAL';
        this.STATE_LOOSING_LIFE = 'STATE_LOOSING_LIFE';

        let player = new Player();

        this.allLevels = [
            new Level_1(player),
            new Level_2(player),
            new Level_3(player),
            new Level_4(player),
            new Level_5(player),
            new Level_6(player)
        ];
        this.currentLevel = this.allLevels[0];

        this.gameStateObjects = new Map([
            ['score', new ScoreText()],
            ['lvl', new LvlText()],
            ['heart', new HeartImage()],
            ['lives', new LivesText()],
            ['pauseMsg', new PauseBottomMessage()]
        ]);

        this.gameLost = false;
        this.gameWon = false;
        this.paused = false;

        this.initLevel();
    }

    resetGame() {
        this.allLevels.forEach(level => level.reset());
        this.currentLevel = this.allLevels[0];
        this.currentLevel.initLevel();

        this.gameStateObjects.forEach(obj => obj.reset());

        this.gameLost = false;
        this.gameWon = false;
        this.paused = false;
    }

    initLevel() {
        let lvl = this.gameStateObjects.get('lvl').lvl;
        this.currentLevel = this.allLevels[lvl - 1];
        this.currentLevel.initLevel();
    }

    update(dt) {
        this.currentLevel.update(dt);
        this.gameStateObjects.forEach(obj => obj.update(dt));
    }

    isRunning() {
        return !this.paused && !this.gameLost && !this.gameWon;
    }

    /**
     * First draw all game objects.
     * And if the game is lost, show loose dialog
     */
    render() {
        this.currentLevel.render();
        this.gameStateObjects.forEach(obj => obj.render());

        if (this.gameLost) {
            this.showLooseDialog();
        }
    }

    showLooseDialog() {
        this.setPause(true);
        engine.showDialog('Game Over!', 'Press \'Enter\' to Play Again');
    }

    winLevel() {
        this.gameStateObjects.get('score').addScore(500);
        this.gameStateObjects.get('lvl').increaseLvl();
        this.initLevel();
    }

    addBonus(bonus) {
        this.gameStateObjects.get('score').addScore(bonus.bonusScore);
        this.gameStateObjects.get('lives').addLives(bonus.bonusLives);
    }

    setGameState(state) {
        let lives = this.gameStateObjects.get('lives');

        switch (state) {
            case this.STATE_NORMAL:
                lives.setStrokeColor(lives.colorWhite);
                if (lives.lives <= 0) {
                    this.gameLost = true;
                }
                break;
            case this.STATE_LOOSING_LIFE:
                lives.setStrokeColor(lives.colorYellow);
                lives.looseLife();
                break;
        }
    }

    setPause(pause) {
        this.paused = pause;
        this.paused ? engine.stop() : engine.start();
    }

    /**
     * Handle 'enter' and 'p' keys.
     * If another key is pressed, delegate handling to current level object
     *
     * @param keyCode
     */
    handleKeyboardInput(keyCode) {
        let allowedKeys = {
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
                if (this.isRunning()) {
                    this.currentLevel.handleKeyboardInput(keyCode);
                }
        }
    }
}

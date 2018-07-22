class Player {
    constructor(game, collisionRectScale) {
        this.game = game;
        this.rect = new Rectangle(80, 90, collisionRectScale);

        this.spriteNormal = 'img/char_boy.png';
        this.spriteSad = 'img/char_boy_sad.png';

        this.colorWhite = '#FFFFFF';
        this.colorYellow = '#FEFC36';
        this.livesTextStrokeColor = this.colorWhite;

        this.reset();
    }

    /**
     * Reset player to default state
     */
    reset() {
        this.resetPosition();
        this.lives = 3;
        this.sprite = this.spriteNormal;
        this.livesTextStrokeColor = this.colorWhite;
    }

    /**
     * Reset player position
     */
    resetPosition() {
        this.row = 5;
        this.col = 2;
        this.sprite = this.spriteNormal;
        this.livesTextStrokeColor = this.colorWhite;
    }

    /**
     * Update player position.
     * This method is called every game tick, so no object should be created inside this method
     *
     * @param dt a time delta between game ticks
     */
    update(dt) {
        let x = 101 * this.col + (101 - this.rect.width) / 2;
        let y = (171 / 2) * this.row + this.rect.height / 2 - 10;

        this.rect.update(x, y);
    }

    /**
     * Draw on the screen using canvas
     */
    render() {
        const ctx = this.game.engine.ctx;
        ctx.drawImage(res.get(this.sprite), this.rect.left, this.rect.top);
        this.rect.drawCollisionBorder(this.game.engine);
    }

    /**
     * Loose life
     */
    // change sprite
    // set pause with timeout
    // after timeout set sprites to normal
    // run in default state
    looseLife() {
        this.lives--;
        this.sprite = this.spriteSad;
        this.livesTextStrokeColor = this.colorYellow;
        this.game.setPause(true);

        setTimeout(() => {
            if (this.lives <= 0) {
                this.game.gameLost = true;
            } else {
                this.resetPosition();
            }
            this.game.setPause(false);
        }, 200);
    }
}

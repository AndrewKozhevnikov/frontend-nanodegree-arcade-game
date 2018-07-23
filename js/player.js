class Player {
    constructor(collisionRectScale) {
        this.rect = new Rectangle(80, 90, collisionRectScale);

        this.spriteNormal = 'img/char_boy.png';
        this.spriteSad = 'img/char_boy_sad.png';

        this.colorWhite = '#FFFFFF';
        this.colorYellow = '#FEFC36';
        this.livesTextStrokeColor = this.colorWhite;

        this.reset();
    }

    setAnimation(animation) {
        this.animation = animation;
    }

    /**
     * Reset player to default state
     */
    reset() {
        this.resetPosition();
        this.lives = 3;
        this.sprite = this.spriteNormal;
        this.livesTextStrokeColor = this.colorWhite;
        this.animation = null;
    }

    /**
     * Reset player position
     */
    // todo row, col
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
        let yOffset = 0;
        if (this.animation != null) {
            yOffset = this.animation.update(dt);
        }

        let x = 101 * this.col + (101 - this.rect.width) / 2;
        let y = (171 / 2) * this.row + this.rect.height / 2 - 10 + yOffset;

        this.rect.update(x, y);
    }

    // get new cloned rect with new updated position
    getUpdatedRect() {
        let rect = this.rect.clone();
        let x = 101 * this.col + (101 - this.rect.width) / 2;
        let y = (171 / 2) * this.row + this.rect.height / 2 - 10;
        rect.update(x, y);

        return rect;
    }

    /**
     * Draw on the screen using canvas
     */
    render() {
        ctx.drawImage(res.get(this.sprite), this.rect.left, this.rect.top);
        // this.rect.drawCollisionBorder();
    }

    /**
     * Loose life.
     * Change sprite.
     * Set pause for 0.2 sec.
     * After timeout reset to default state
     */
    looseLife() {
        this.lives--;
        this.sprite = this.spriteSad;
        this.livesTextStrokeColor = this.colorYellow;
        game.setPause(true);

        setTimeout(() => {
            if (this.lives <= 0) {
                game.gameLost = true;
            } else {
                this.resetPosition();
            }
            game.setPause(false);
        }, 200);
    }
}

class FrameDrawable extends BaseDrawable {
    constructor(sprites, left, top, spritesChangeSpeed, collisionRectScale = 0.6) {
        super();
        this.sprites = sprites;
        this.speed = spritesChangeSpeed;
        this.index = random(0, 7);
        this._initRect(left, top, sprites[0].width, sprites[0].height, collisionRectScale);
    }

    update(dt) {
        this.index = this.index + this.speed * dt;
        if (Math.floor(this.index) >= this.sprites.length) {
            this.index = 0;
        }

        super.update(dt);
    }

    render() {
        let i = Math.floor(this.index);
        ctx.drawImage(this.sprites[i], this.rect.left, this.rect.top);

        super.render();
    }
}
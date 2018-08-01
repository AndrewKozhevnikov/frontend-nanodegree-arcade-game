class SharkFinEnemy extends BaseEnemy {
    constructor(image, left, top) {
        super(image, left, top);

        this.imageNormal = res.get('img/enemy_shark_fin.png');
        this.imageRevert = res.get('img/enemy_shark_fin_revert.png');
    }

    getRunAnimation(speed) {
        return new ForwardBackAnimation(this.rect, 'left', speed, 0, canvasWidth, -1, this.rect.width);
    }

    update(dt) {
        super.update(dt);

        if (this.rect.left <= 0) {
            this.drawable.setImage(this.imageNormal);
            this.runAnimation.speed = random(this.minSpeed, this.maxSpeed);
        } else if (this.rect.left + this.rect.width >= canvasWidth) {
            this.drawable.setImage(this.imageRevert);
            this.runAnimation.speed = random(this.minSpeed, this.maxSpeed);
        }
    }
}
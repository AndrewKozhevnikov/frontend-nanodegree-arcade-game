class BaseEnemy {
    constructor(image, left, top) {
        this.image = image;
        this.drawable = this.createDrawable(left, top);
        this.minSpeed = 150;
        this.maxSpeed = 300;

        let speed = random(this.minSpeed, this.maxSpeed);
        this.runAnimation = this.createRunAnimation(speed);
        this.drawable.addAnimation(this.runAnimation);
    }

    get rect() {
        return this.drawable.rect;
    }

    createDrawable(left, top) {
        return new ImageDrawable(this.image, left, top);
    }

    createRunAnimation(speed) {
        return new LinearAnimation(this.rect, 'left', speed, 0, canvasWidth);
    }

    render() {
        this.drawable.render();
    }

    resetPosition() {
        this.drawable.resetAnimations();
        this.drawable.updateRectCoordinates(0, this.rect.top);
        this.runAnimation.speed = random(this.minSpeed, this.maxSpeed);
    }

    update(dt) {
        this.drawable.update(dt);

        if (this.rect.left >= canvasWidth) {
            this.resetPosition();
        }
    }
}
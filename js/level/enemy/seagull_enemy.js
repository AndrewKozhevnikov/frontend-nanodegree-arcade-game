class SeagullEnemy extends BaseEnemy {
    constructor(image, left, top) {
        super(image, left, top);

        this.STATE_NORMAL = 'STATE_NORMAL';
        this.STATE_FALLING = 'STATE_FALLING';
        this.currentState = this.STATE_NORMAL;
    }

    createDrawable(left, top) {
        this.sprites = [
            res.get('img/seagull_0.png'),
            res.get('img/seagull_1.png'),
            res.get('img/seagull_2.png'),
            res.get('img/seagull_3.png'),
            res.get('img/seagull_4.png'),
            res.get('img/seagull_5.png'),
            res.get('img/seagull_6.png'),
            res.get('img/seagull_7.png')
        ];

        this.frameDrawable = new FrameDrawable(this.sprites, left, top, 10);
        this.drawable = this.frameDrawable;

        this.fallDownDrawable = new ImageDrawable(res.get('img/seagull_loose_life.png'),
            this.drawable.rect.left, this.drawable.rect.top);
        this.fallDownAnimation = new LinearAnimation(this.fallDownDrawable.rect, 'top', 300, this.fallDownDrawable.rect.top, canvasHeight);
        this.fallDownAnimation.setOnAnimationEndCallback(() => this.setState(this.STATE_NORMAL));
        this.fallDownDrawable.addAnimation(this.fallDownAnimation);

        return this.frameDrawable;
    }

    setState(state) {
        this.currentState = state;

        switch (state) {
            case this.STATE_NORMAL:
                this.runAnimation.setValues(0, canvasWidth);
                this.runAnimation.reset();
                this.frameDrawable.updateRectCoordinates(0, this.frameDrawable.rect.top);
                this.drawable = this.frameDrawable;
                break;
            case this.STATE_FALLING:
                this.fallDownAnimation.setValues(this.drawable.rect.top, canvasHeight);
                this.fallDownAnimation.reset();
                this.fallDownDrawable.updateRectCoordinates(this.drawable.rect.left, this.drawable.rect.top);
                this.drawable = this.fallDownDrawable;
                break;
        }
    }

    // reset() or resetPosition
}

class BugEnemy extends BaseEnemy {
    constructor(image, left, top) {
        super(image, left, top);

        this.jumpSpeed = 70;
        this.jumpHeight = 10;
        this.jumpAnimationTimeout = 600;

        this.beforeJumpY = this.rect.top;
        this.jumpToY = this.rect.top - this.jumpHeight;

        this.jumpAnimation = new ForwardBackAnimation(this.rect, 'top',
            this.jumpSpeed, this.rect.top, this.jumpToY, 1);

        this.jumpAnimation.setOnAnimationEndCallback(() => {
            setTimeout(() => {
                this.removeJumpAnimation();
            }, this.jumpAnimationTimeout);
        });
    }

    removeJumpAnimation() {
        this.rect.top = this.beforeJumpY;

        this.jumpAnimation.reset();
        this.drawable.removeAnimation(this.jumpAnimation);
    }

    resetPosition() {
        this.removeJumpAnimation();
        super.resetPosition();
    }

    jump() {
        this.jumpAnimation.setValues(this.rect.top, this.jumpToY);
        this.drawable.addAnimation(this.jumpAnimation);
    }

    isJumping() {
        return this.drawable.hasAnimation(this.jumpAnimation);
    }
}

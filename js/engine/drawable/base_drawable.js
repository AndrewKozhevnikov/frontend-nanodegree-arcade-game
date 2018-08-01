/**
 * Abstract class. Should not be instantiated
 */
class BaseDrawable {
    constructor() {
        this.alpha = 1;
        this.scale = 1;
        this.rotateRad = 0;
        this.animations = [];
        this.renderCollisionRect = false;
    }

    // protected method
    // should always be called from inheritor constructor
    // and if image/text is completely changed
    _initRect(left, top, width, height, rectScale = 1) {
        this.rect = new Rect(left, top, width, height, rectScale);
    }

    resetAnimations() {
        this.animations.forEach(animation => animation.reset());
    }

    updateRectCoordinates(left = this.rect.left, top = this.rect.top) {
        if (this.rect == null) {
            throw new Error('Rect is not initialized. It should be initialized in drawable constructor.');
        }

        this.rect.left = left;
        this.rect.top = top;
    }

    addAnimation(animation) {
        if (!this.hasAnimation(animation)) {
            this.animations.push(animation);
        }
    }

    removeAnimation(animation) {
        if (this.hasAnimation(animation)) {
            this.animations.remove(animation);
        }
    }

    hasAnimation(animation) {
        return this.animations.indexOf(animation) !== -1;
    }

    /**
     * Update position.
     * This method is called every game tick, so no object should be created inside this method
     *
     * @param dt a time delta between game ticks
     */
    update(dt) {
        this.animations.forEach(animation => animation.update(dt));
    }

    render(parentRectLeft = 0, parentRectTop = 0) {
        if (this.renderCollisionRect) {
            this.rect.renderCollisionRect(parentRectLeft, parentRectTop);
        }
    }
}
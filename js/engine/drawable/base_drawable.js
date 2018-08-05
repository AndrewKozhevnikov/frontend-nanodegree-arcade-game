/**
 * An abstraction for something that can be drawn on canvas.
 * Subclasses will provide logic to render exact elements (like images/text etc.)
 * This abstract class should not be instantiated.
 */
class BaseDrawable {
    constructor() {
        this.alpha = 1;
        this.scale = 1;
        this.animations = [];

        // set to true to render all drawables collision rectangles
        this.renderCollisionRect = false;
        // this.renderCollisionRect = true;
    }

    /**
     * Creates drawable bounds rectangle
     * This method should always be called from inheritor constructor
     * and if image/text is completely changed
     *
     * @protected
     */
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
        animation.reset();
        if (this.hasAnimation(animation)) {
            this.animations.remove(animation);
        }
    }

    hasAnimation(animation) {
        return this.animations.indexOf(animation) !== -1;
    }

    update(dt) {
        this.animations.forEach(animation => animation.update(dt));
    }

    /**
     * Draw collision rect bounds
     * It can be drawn in canvas global coordinates or relative to parent rect
     *
     * @param parentRectLeft
     * @param parentRectTop
     */
    render(parentRectLeft = 0, parentRectTop = 0) {
        if (this.renderCollisionRect) {
            this.rect.renderCollisionRect(parentRectLeft, parentRectTop);
        }
    }
}
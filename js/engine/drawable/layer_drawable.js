/**
 * Container for drawables.
 * Can apply animation to the whole group of drawables.
 */
class LayerDrawable extends BaseDrawable {
    constructor(drawables, left, top, width, height, collisionRectScale = 1) {
        super();
        this.drawables = drawables;

        this._initRect(left, top, width, height, collisionRectScale);
    }

    update(dt) {
        super.update(dt);
        this.drawables.forEach(drawable => drawable.update(dt));
    }

    render() {
        this.drawables.forEach(drawable => drawable.render(this.rect.left, this.rect.top));

        super.render();
    }
}

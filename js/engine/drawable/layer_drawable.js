class LayerDrawable extends BaseDrawable {
    constructor(drawables, left, top, width, height) {
        super();
        this.drawables = drawables;

        this._initRect(left, top, width, height, 0.6);
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

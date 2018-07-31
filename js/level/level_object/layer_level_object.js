class LayerLevelObject {
    constructor(drawables, left, top, width, height, passable, collectible, bonus) {
        this.drawable = new LayerDrawable(drawables, left, top, width, height);
        this.passable = passable;
        this.collectible = collectible;
        this.bonus = bonus;
    }

    get rect() {
        return this.drawable.rect;
    }

    render() {
        this.drawable.render();
    }

    update(dt) {
        this.drawable.update(dt);
    }

    addAnimation(animation) {
        this.drawable.addAnimation(animation);
    }
}
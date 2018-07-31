class LevelObject {
    constructor(image, left, top, passable, collectible, bonus) {
        this.drawable = new ImageDrawable(image, left, top);
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
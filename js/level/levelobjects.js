// Just an empty, not passable object with no functionality at all
class EmptyBarrier {
    constructor() {
        this.passable = false;
        this.collectible = false;
    }

    update(dt) {
    }

    render() {
    }

    setCoordinates(x, y) {
    }
}

class LevelObject extends ImageDrawable {
    constructor(imageUrl, passable, collectible, bonus) {
        super(imageUrl);
        this.passable = passable;
        this.collectible = collectible;
        this.bonus = bonus;
    }
}

class LayerLevelObject extends LayerDrawable {
    constructor(drawables, mainImageIndex, passable, collectible, bonus) {
        super(drawables, mainImageIndex);
        this.passable = passable;
        this.collectible = collectible;
        this.bonus = bonus;
    }
}

class Bonus {
    constructor({bonusScore = 0, bonusLives = 0} = {}) {
        this.bonusScore = bonusScore;
        this.bonusLives = bonusLives;
    }

    getBonusText() {
        let text = ``;

        if (this.bonusScore > 0) {
            text += `+ ${this.bonusScore} Score\n`;
        }

        if (this.bonusLives === 1) {
            text += `+ ${this.bonusLives} Life`;
        } else if (this.bonusLives > 1) {
            text += `+ ${this.bonusLives} Lives`;
        }

        return text;
    }
}

class ScrollBonus extends Bonus {
}
class LevelObject extends RenderedImage {
    constructor(sprite, passable, collectible, bonus) {
        super(sprite);
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
class LevelObject {
    constructor(sprite, passable, collectible, bonus, animation) {
        this.sprite = sprite;
        this.passable = passable;
        this.collectible = collectible;
        this.bonus = bonus;
        this.animation = animation;
        this.yOffset = 0;
    }

    setYOffset(yOffset) {
        this.yOffset = yOffset;
    }

    render(row, col) {
        if (this.sprite != null) {
            ctx.drawImage(res.get(this.sprite), col * 101, 83 + (row * 83) - 30 + this.yOffset);
        }
    }

    update(dt) {
        if (this.animation != null) {
            this.yOffset = this.animation.update(dt);
        }
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
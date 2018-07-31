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
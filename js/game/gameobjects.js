class ScoreText extends RenderedShadowText {
    constructor() {
        super('Score: 0', 20, 90,
            {font: 'bold 24px Arial', fillStyle: '#FEFC36', strokeStyle: '#000000', lineWidth: 3, textAlign: 'left'});
        this.score = 0;
    }

    addScore(score) {
        this.score += score;
        this.setText('Score: ' + this.score);
    }

    reset() {
        this.score = 0;
        this.setText('Score: ' + this.score);
    }
}

class LvlText extends RenderedShadowText {
    constructor() {
        super('Lvl: 1', canvasWidth - 20, 90,
            {font: 'bold 24px Arial', fillStyle: '#FEFC36', strokeStyle: '#000000', lineWidth: 3, textAlign: 'right'});
        this.lvl = 1;
    }

    increaseLvl() {
        this.lvl++;
        this.setText('Lvl: ' + this.lvl);
    }

    reset() {
        this.lvl = 1;
        this.setText('Lvl: ' + this.lvl);
    }
}

class HeartImage extends RenderedImage {
    constructor() {
        super('img/heart_mini.png', 20, canvasHeight - 68);
    }

    reset(){
    }
}

class LivesText extends RenderedShadowText {
    constructor() {
        super('x 3', 60, canvasHeight - 45,
            {font: '24px Arial', fillStyle: '#000000', strokeStyle: '#FFFFFF', lineWidth: 4, textAlign: 'left'});
        this.lives = 3;
        this.colorWhite = '#FFFFFF';
        this.colorYellow = '#FEFC36';
    }

    addLives(lives) {
        this.lives += lives;
        this.setText('x ' + this.lives);
    }

    looseLife() {
        if (this.lives - 1 >= 0) {
            this.lives--;
        }

        this.setText('x ' + this.lives);
    }

    reset() {
        this.lives = 3;
        this.setStrokeColor(this.colorWhite);
        this.setText('x ' + this.lives);
    }
}

class PauseBottomMessage extends RenderedText {
    constructor() {
        super('Press \'p\' to pause or resume', canvasWidth - 10, canvasHeight - 45,
            {font: '18px Arial', fillStyle: '#FFFFFF', textAlign: 'right'});
    }

    reset() {
    }
}
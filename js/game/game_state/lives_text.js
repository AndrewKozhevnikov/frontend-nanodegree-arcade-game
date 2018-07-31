class LivesText extends ShadowTextDrawable {
    constructor() {
        super('x 3', 60, canvasHeight - 26, '#FFFFFF', 4,
            {color: '#000000', textAlign: 'left'});

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
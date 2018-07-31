class ScoreText extends ShadowTextDrawable {
    constructor() {
        super('Score: 0', 20, 90, '#000000', 3,
            {color: '#FEFC36', textAlign: 'left'},
            {fontWeight: 'bold'});
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
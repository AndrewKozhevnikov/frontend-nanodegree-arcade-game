class Player extends ImageDrawable {
    constructor() {
        super('img/char_boy.png');

        this.imageNormal = res.get('img/char_boy.png');
        this.imageSad = res.get('img/char_boy_sad.png');

        this.swimAnimation = new UpDownAnimator(this, 'y', 12, this.y, this.y + 8);

        this.reset();
    }

    getSwimAnimation() {
        return this.swimAnimation;
    }

    /**
     * Reset player to default state
     */
    reset() {
        this.setPositionOnBoard(5, 2);
        this.image = this.imageNormal;
        this.removeAnimation(this.swimAnimation);
    }

    /**
     * Reset player position
     */
    setPositionOnBoard(row, col) {
        this.row = row;
        this.col = col;
        const x = this.col * colWidth + (colWidth - this.image.width) / 2;
        const y = row * rowHeight + nextRowVisibleTop - this.image.height;
        this.setCoordinates(x, y);


        // todo looks terrible to init in constructor and then to set coordinates somewhere else
        this.swimAnimation.setValues(this.y, this.y + 8);
    }

    setImage(image) {
        this.image = image;
    }
}

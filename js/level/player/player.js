class Player {
    constructor(row = 5, col = 2) {
        this.STATE_NORMAL = 'STATE_NORMAL';
        this.STATE_HAPPY = 'STATE_HAPPY';
        this.STATE_SAD = 'STATE_SAD';
        this.STATE_SWIMMING = 'STATE_SWIMMING';

        this.row = row;
        this.col = col;

        this.imageNormal = res.get('img/char_boy.png');
        this.imageHappy = res.get('img/char_boy_happy.png');
        this.imageSad = res.get('img/char_boy_sad.png');
        let image = this.imageNormal;

        let left = this.col * colWidth + (colWidth - image.width) / 2;
        let top = this.row * rowHeight + nextRowVisibleTop - image.height;
        this.drawable = new ImageDrawable(image, left, top);

        this.swimAnimation = new ForwardBackAnimation(this.rect, 'top', 12, this.rect.top, this.rect.top + 8);

        this.changePositionOnBoard(row, col);
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

    setState(state) {
        switch (state) {
            case this.STATE_NORMAL:
                this.drawable.setImage(this.imageNormal);
                this.drawable.removeAnimation(this.swimAnimation);
                break;
            case this.STATE_HAPPY:
                this.drawable.setImage(this.imageHappy);
                this.drawable.removeAnimation(this.swimAnimation);
                break;
            case this.STATE_SAD:
                this.drawable.setImage(this.imageSad);
                this.drawable.removeAnimation(this.swimAnimation);
                break;
            case this.STATE_SWIMMING:
                this.drawable.setImage(this.imageNormal);
                this.drawable.addAnimation(this.swimAnimation);
                break;
        }
    }

    /**
     * Reset player to default state
     */
    reset(row, col, waterLevel) { // todo rename
        this.changePositionOnBoard(row, col);
        if (waterLevel) {
            this.setState(this.STATE_SWIMMING);
        } else {
            this.setState(this.STATE_NORMAL);
        }
    }

    /**
     * Reset player position
     */
    changePositionOnBoard(row, col) {
        this.row = row;
        this.col = col;
        let left = this.col * colWidth + (colWidth - this.rect.width) / 2;
        let top = row * rowHeight + nextRowVisibleTop - this.rect.height;

        this.drawable.updateRectCoordinates(left, top);

        this.swimAnimation.setValues(this.rect.top, this.rect.top + 8);
    }
}

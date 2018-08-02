class Player {
    constructor(row = 5, col = 2) {
        this.STATE_NORMAL = 'STATE_NORMAL';
        this.STATE_HAPPY = 'STATE_HAPPY';
        this.STATE_SAD = 'STATE_SAD';
        this.STATE_SWIMMING = 'STATE_SWIMMING';
        this.STATE_UNDERWATER = 'STATE_UNDERWATER';
        this.STATE_FALLING = 'STATE_FALLING';
        this.STATE_TALKING = 'STATE_TALKING';

        this.currentState = this.STATE_NORMAL;

        this.row = row;
        this.col = col;

        this.imageNormal = res.get('img/char_boy.png');
        this.imageHappy = res.get('img/char_boy_happy.png');
        this.imageSad = res.get('img/char_boy_sad.png');
        let image = this.imageNormal;

        this.carriedItem = null;

        let left = this.col * colWidth + (colWidth - image.width) / 2;
        let top = this.row * rowHeight + nextRowVisibleTop - image.height;
        this.drawable = new ImageDrawable(image, left, top);

        this.swimAnimation = new ForwardBackAnimation(this.rect, 'top', 12, this.rect.top, this.rect.top + 8);

        let valueFrom = nextRowVisibleTop - this.rect.height;
        let valueTo = 5 * rowHeight + nextRowVisibleTop - this.rect.height;
        this.fallAnimation = new LinearAnimation(this.rect, 'top', 200, valueFrom, valueTo);
        this.fallAnimation.setOnAnimationEndCallback(() => {
            this.changePositionOnBoard(5, 0);
            this.setState(this.STATE_TALKING);

            if (this.currentLevel instanceof Level_5) {
                this.currentLevel.startDialog();
            }
        });

        this.underwaterLevel = false;

        this.bubbles = [
            new Bubble(this),
            new Bubble(this),
            new Bubble(this),
            new Bubble(this),
            new Bubble(this)
        ];
        this.changePositionOnBoard(row, col);
    }

    get rect() {
        return this.drawable.rect;
    }

    carry(item) {
        this.carriedItem = item;
    }

    render() {
        this.drawable.render();

        if (this.carriedItem != null) {
            this.carriedItem.render();
        }

        if (this.underwaterLevel) {
            this.bubbles.forEach(b => b.render());
        }
    }

    update(dt) {
        this.drawable.update(dt);

        if (this.carriedItem != null) {
            let left = this.rect.right - 20;
            let top = this.rect.top + this.rect.height / 2;
            this.carriedItem.updateRectCoordinates(left, top);
        }

        if (this.underwaterLevel) {
            this.bubbles.forEach(b => b.update(dt));
        }
    }

    setState(state) {
        this.currentState = state;

        switch (state) {
            case this.STATE_NORMAL:
                this.drawable.setImage(this.imageNormal);
                this.drawable.removeAnimation(this.swimAnimation);
                this.drawable.removeAnimation(this.fallAnimation);
                break;
            case this.STATE_HAPPY:
                this.drawable.setImage(this.imageHappy);
                this.drawable.removeAnimation(this.swimAnimation);
                this.drawable.removeAnimation(this.fallAnimation);
                break;
            case this.STATE_SAD:
                this.drawable.setImage(this.imageSad);
                this.drawable.removeAnimation(this.swimAnimation);
                this.drawable.removeAnimation(this.fallAnimation);
                break;
            case this.STATE_SWIMMING:
                this.drawable.setImage(this.imageNormal);
                this.drawable.removeAnimation(this.fallAnimation);
                this.drawable.addAnimation(this.swimAnimation);
                break;
            case this.STATE_UNDERWATER:
                this.drawable.setImage(this.imageNormal);
                this.drawable.removeAnimation(this.fallAnimation);
                this.drawable.addAnimation(this.swimAnimation);
                break;
            case this.STATE_FALLING:
                this.bubbles.forEach(b => b.resetPosition());
                this.drawable.setImage(this.imageNormal);
                this.drawable.removeAnimation(this.swimAnimation);
                this.drawable.addAnimation(this.fallAnimation);
                break;
            case this.STATE_TALKING:
                this.drawable.setImage(this.imageNormal);
                this.drawable.addAnimation(this.swimAnimation);
                break;
        }
    }

    /**
     * Reset player to default state
     */
    reset(level, row, col) { // todo rename
        this.currentLevel = level;
        this.underwaterLevel = level.isUnderWaterLevel();

        this.changePositionOnBoard(row, col);
        if (level.isWaterLevel()) {
            this.setState(this.STATE_SWIMMING);
        } else if (level.isUnderWaterLevel()) {
            this.setState(this.STATE_FALLING);
        } else {
            this.setState(this.STATE_NORMAL);
        }

        this.carriedItem = null;
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

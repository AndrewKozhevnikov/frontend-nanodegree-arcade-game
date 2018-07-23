class Rectangle {
    constructor(width, height, scale) {
        this.width = width;
        this.height = height;
        this.scale = scale;

        this.horizontalOffset = (this.width - this.width * this.scale) / 2;
        this.verticalOffset = (this.height - this.height * this.scale) / 2;

        this.update(0, 0);
    }

    get centerX() {
        return this.left + this.width / 2;
    }

    get centerY() {
        return this.top + this.height / 2;
    }

    clone() {
        let clone = new Rectangle(this.width, this.height, this.scale);
        clone.update(this.left, this.top);

        return clone;
    }

    update(left, top) {
        this.left = left;
        this.top = top;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    }

    collidesWith(rect2) {
        return (this.left + this.horizontalOffset < rect2.right - rect2.horizontalOffset) &&
            (this.right - this.horizontalOffset > rect2.left + rect2.horizontalOffset) &&
            (this.top + this.verticalOffset < rect2.bottom - rect2.verticalOffset) &&
            (this.bottom - this.verticalOffset > rect2.top + rect2.verticalOffset);
    }

    /**
     * For debugging
     */
    drawCollisionBorder() {
        let left = this.left + this.horizontalOffset;
        let top = this.top + this.verticalOffset;
        let right = this.right - this.horizontalOffset;
        let bottom = this.bottom - this.verticalOffset;

        engine.stroke(left, top, right, bottom);
    }
}

class CollisionRectangle {
    constructor(x, y, width, height, scale) {
        this.update(x, y, width, height, scale);
    }

    update(x, y, width, height, scale) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scale = scale;

        this.horizontalOffset = (this.width - this.width * this.scale) / 2;
        this.verticalOffset = (this.height - this.height * this.scale) / 2;

        this.right = this.x + this.width;
        this.bottom = this.y + this.height;
        this.centerX = this.x + this.width / 2;
        this.centerY = this.y + this.height / 2;
    }

    collidesWith(rect2) {
        return (this.x + this.horizontalOffset < rect2.right - rect2.horizontalOffset) &&
            (this.right - this.horizontalOffset > rect2.x + rect2.horizontalOffset) &&
            (this.y + this.verticalOffset < rect2.bottom - rect2.verticalOffset) &&
            (this.bottom - this.verticalOffset > rect2.y + rect2.verticalOffset);
    }

    /**
     * For debugging
     */
    drawCollisionBorder() {
        let x = this.x + this.horizontalOffset;
        let y = this.y + this.verticalOffset;
        let right = this.right - this.horizontalOffset;
        let bottom = this.bottom - this.verticalOffset;

        engine.stroke(x, y, right, bottom);
    }
}

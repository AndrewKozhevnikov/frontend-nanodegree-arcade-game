class Rect {
    constructor(left, top, width, height, collisionScale = 1) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;

        this.horizontalOffset = (width - width * collisionScale) / 2;
        this.verticalOffset = (height - height * collisionScale) / 2;
    }

    get right() {
        return this.left + this.width;
    }

    get bottom() {
        return this.top + this.height;
    }

    get centerX() {
        return this.left + this.width / 2;
    }

    get centerY() {
        return this.top + this.height / 2;
    }

    collidesWith(other) {
        // return false;

        if (other == null) {
            return false;
        }

        return (this.left + this.horizontalOffset < other.right - other.horizontalOffset) &&
            (this.right - this.horizontalOffset > other.left + other.horizontalOffset) &&
            (this.top + this.verticalOffset < other.bottom - other.verticalOffset) &&
            (this.bottom - this.verticalOffset > other.top + other.verticalOffset);
    }

    /**
     * For debugging
     */
    renderCollisionRect(parentRectLeft = 0, parentRectTop = 0) {
        let left = this.left + this.horizontalOffset;
        let top = this.top + this.verticalOffset;
        let right = this.right - this.horizontalOffset;
        let bottom = this.bottom - this.verticalOffset;

        left += parentRectLeft;
        top += parentRectTop;
        right += parentRectLeft;
        bottom += parentRectTop;

        engine.stroke(left, top, right, bottom);
    }
}

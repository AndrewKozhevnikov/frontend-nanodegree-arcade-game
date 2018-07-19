class Rectangle {
    constructor(width, height, scale) {
        this.width = width;
        this.height = height;
        this.scale = scale;

        this.horizontalOffset = (this.width - this.width * this.scale) / 2;
        this.verticalOffset = (this.height - this.height * this.scale) / 2;

        this.update(0, 0);
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
            (this.bottom - this.verticalOffset> rect2.top + rect2.verticalOffset);
    }

    /**
     * For debugging
     */
    drawCollisionBorder() {
        ctx.beginPath();
        ctx.moveTo(this.left + this.horizontalOffset, this.top + this.verticalOffset);
        ctx.lineTo(this.right - this.horizontalOffset, this.top + this.verticalOffset);
        ctx.lineTo(this.right - this.horizontalOffset, this.bottom - this.verticalOffset);
        ctx.lineTo(this.left + this.horizontalOffset, this.bottom - this.verticalOffset);
        ctx.closePath();
        ctx.stroke();
    }
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showDialog(title, msg) {
    ctx.fillRect(20, 20, 505 - 20, 606 - 20);
}
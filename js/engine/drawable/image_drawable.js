class ImageDrawable extends BaseDrawable {
    constructor(image, left, top, collisionRectScale = 0.6) {
        super();
        this.image = image;
        this._initRect(left, top, image.width, image.height, collisionRectScale);
    }

    setImage(image) {
        this.image = image;
    }

    /**
     * Draw on the screen using canvas
     * This method is a performance bottle neck
     */
    render(parentRectLeft = 0, parentRectTop = 0) {
        ctx.globalAlpha = this.alpha;
        this.drawImage(parentRectLeft, parentRectTop);
        ctx.globalAlpha = 1;

        super.render(parentRectLeft, parentRectTop);
    }

    drawImage(parentRectLeft, parentRectTop) {
        let left;
        let top;
        let width;
        let height;

        // (this.scale === 1) is used to avoid unnecessary calculations while rendering
        if (this.scale === 1) {
            width = this.rect.width;
            height = this.rect.height;
            left = this.rect.left;
            top = this.rect.top;
        } else {
            width = this.rect.width * this.scale;
            height = this.rect.height * this.scale;
            left = this.rect.left + (this.rect.width - width) / 2;
            top = this.rect.top + (this.rect.height - height) / 2;
        }

        left += parentRectLeft;
        top += parentRectTop;

        ctx.drawImage(this.image, left, top, width, height);
    }
}
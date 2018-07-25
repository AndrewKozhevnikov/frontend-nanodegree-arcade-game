class RenderedObject {
    constructor(x, y) {
        this.setCoordinates(x, y);
        this.alpha = 1;
        this.xOffset = 0;
        this.yOffset = 0;
        this.alphaOffset = 0;
    }

    setCoordinates(x, y) {
        this.x = x;
        this.y = y;
    }

    setAnimation(animation) {
        this.animation = animation;
    }

    applyAnimation(dt) {
        const anim = this.animation;

        if (anim instanceof MoveLeftAnimation || anim instanceof MoveRightAnimation ||
            anim instanceof MoveLeftRightAnimation) {
            this.xOffset = anim.update(dt);
        } else if (anim instanceof MoveUpAnimation || anim instanceof MoveDownAnimation ||
            anim instanceof MoveUpDownAnimation) {
            this.yOffset = anim.update(dt);
        } else if (anim instanceof FadeOutAnimation) {
            this.alphaOffset = anim.update(dt);
        }
    }

    /**
     * Update position.
     * This method is called every game tick, so no object should be created inside this method
     *
     * @param dt a time delta between game ticks
     */
    update(dt) {
        if (this.animation != null) {
            this.applyAnimation(dt);
        }

        this.x = this.x + this.xOffset;
        this.y = this.y + this.yOffset;

        if (this.alpha <= 0.15) { // just turn it off at some point
            this.alpha = 0;
        } else {
            this.alpha = this.alpha + this.alphaOffset;
        }
    }

    render() {
    }
}

class RenderedText extends RenderedObject {
    constructor(text, x, y, {font, fillStyle, textAlign}) {
        super(x, y);
        this.text = text;
        this.textStyle = {font, fillStyle, textAlign};
        this.lineHeight = 15;
    }

    setText(text) {
        this.text = text;
    }

    render() {
        let lines = this.text.split('\n');

        for (let i = 0; i < lines.length; i++) {
            engine.fillText(lines[i], this.x, this.y + (i * this.lineHeight), this.textStyle);
        }
    }
}

class RenderedShadowText extends RenderedObject {
    constructor(text, x, y, {font, fillStyle, strokeStyle, lineWidth, textAlign}) {
        super(x, y);
        this.text = text;
        this.textStyle = {font, fillStyle, strokeStyle, lineWidth, textAlign};
    }

    setText(text) {
        this.text = text;
    }

    setStrokeColor(color) {
        this.textStyle.strokeStyle = color;
    }

    render() {
        engine.strokeAndFillText(this.text, this.x, this.y, this.textStyle);
    }
}

class RenderedImage extends RenderedObject {
    constructor(imageUrl, x, y) {
        super(x, y);
        this.image = res.get(imageUrl);
        this.collisionRectScale = 0.6;
        this.rect = new CollisionRectangle(x, y, this.image.width, this.image.height, this.collisionRectScale);
    }

    update(dt) {
        super.update(dt);
        this.rect.update(this.x, this.y, this.image.width, this.image.height, this.collisionRectScale);
    }

    /**
     * Draw on the screen using canvas
     */
    render() {
        // todo remove
        // if (this.image == null) {
        //     return;
        // }

        if (this.alphaOffset !== 0) {
            this.renderWithAlpha();
        } else {
            this.renderImage();
        }
    }

    renderWithAlpha() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        this.renderImage();
        ctx.restore();
    }

    renderImage() {
        ctx.drawImage(this.image, this.x, this.y);
        this.rect.drawCollisionBorder();
    }
}
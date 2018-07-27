class Drawable {
    constructor(x, y) {
        this.setCoordinates(x, y);
        this.alpha = 1;
        this.alphaOffset = 0;
        this.xOffset = 0;
        this.yOffset = 0;
        this.scale = 0;
    }

    setCoordinates(x, y) {
        this.x = x;
        this.y = y;
    }

    setAnimation(animation) {
        this.animation = animation;
    }

    applyAnimation(anim, dt) {
        if (anim instanceof MoveLeftAnimation || anim instanceof MoveRightAnimation ||
            anim instanceof MoveLeftRightAnimation) {
            this.xOffset = anim.update(dt);
        } else if (anim instanceof MoveUpAnimation || anim instanceof MoveDownAnimation ||
            anim instanceof MoveUpDownAnimation || anim instanceof JumpAnimation) {
            this.yOffset = anim.update(dt);
        } else if (anim instanceof FadeOutAnimation) {
            this.alphaOffset = anim.update(dt);
        } else if (anim instanceof ScaleUpDownAnimation) {
            this.scale = anim.update(dt);
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
            this.applyAnimation(this.animation, dt);
        }

        this.scale = this.scale;
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

class TextDrawable extends Drawable {
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

class ShadowTextDrawable extends Drawable {
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

class ImageDrawable extends Drawable {
    constructor(imageUrl, x, y) {
        super(x, y);
        this.image = res.get(imageUrl);
        this.collisionRectScale = 0.6;
        this.rect = new CollisionRectangle(x, y, this.image.width, this.image.height, this.collisionRectScale);
        this.drawCollisionRect = false;
    }

    update(dt) {
        super.update(dt);
        this.rect.update(this.x, this.y, this.image.width, this.image.height, this.collisionRectScale);
    }

    /**
     * Draw on the screen using canvas
     */
    render() {
        if (this.alphaOffset !== 0) {
            this.renderWithAlpha();
        } else if (this.scale !== 0) {
            this.renderWithScale();
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

    renderWithScale() {
        let offsetX = (this.image.width - this.image.width * this.scale) / 2;
        let scaleX = (this.x + offsetX) / this.scale;

        let offsetY = (this.image.height - this.image.height * this.scale) / 2;
        let scaleY = (this.y + offsetY) / this.scale;

        ctx.save();
        ctx.scale(this.scale, this.scale);
        ctx.drawImage(this.image, scaleX, scaleY);
        ctx.restore();

        if (this.drawCollisionRect) {
            this.rect.drawCollisionBorder();
        }
    }

    renderImage() {
        ctx.drawImage(this.image, this.x, this.y);

        if (this.drawCollisionRect) {
            this.rect.drawCollisionBorder();
        }
    }
}

class LayerDrawable {
    constructor(drawables) {
        this.drawables = drawables;
    }

    get image() {
        return this.drawables[this.drawables.length - 1].image;
    }

    get rect() {
        return this.drawables[this.drawables.length - 1].rect;
    }

    update(dt) {
        this.drawables.forEach(drawable => drawable.update(dt));
    }

    render() {
        this.drawables.forEach(drawable => drawable.render());
    }

    setCoordinates(x, y) {
        this.drawables.forEach(drawable => drawable.setCoordinates(x, y));
    }

    setLayerAnimation(index, animation) {
        this.drawables[index].setAnimation(animation);
    }

    setAnimation(animation) {
        this.drawables.forEach(drawable => drawable.setAnimation(animation));
    }
}

class RadialGradientDrawable extends Drawable {
    constructor(x, y, diameter) {
        super(x, y);
        this.diameter = diameter;
        this.gradientRadius = this.diameter; // todo start radius setAnimation
    }

    update(dt) {
        if (this.animation != null) {
            this.gradientRadius = this.animation.update(dt);
        }
    }

    render() {
        let r = this.diameter / 2;
        let x = this.x + r;
        let y = this.y + r;
        this.gradient = ctx.createRadialGradient(x, y, 0, x, y, this.gradientRadius);
        this.gradient.addColorStop(0, 'rgba(255, 165, 0, 1)'); // 0
        this.gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');

        ctx.fillStyle = this.gradient;
        ctx.fillRect(this.x - 50, this.y - 50, 400, 400); // todo 50? find out how to set rect upper left corner
    }
}

class ColorDrawable extends Drawable {

}

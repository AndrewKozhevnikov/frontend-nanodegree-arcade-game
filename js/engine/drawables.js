/**
 * Abstract class. Should not be instantiated
 */
class Drawable {
    constructor(x, y) {
        this.setCoordinates(x, y);
        this.alpha = 1;
        this.scale = 1;
        this.rotateRad = 0;
        this.animations = [];
    }

    setCoordinates(x, y) {
        this.x = x;
        this.y = y;
    }

    addAnimation(animation) {
        this.animations.push(animation);
    }

    removeAnimation(animation) {
        this.animations.remove(animation);
    }

    hasAnimation(animation) {
        return this.animations.indexOf(animation) !== -1;
    }

    /**
     * Update position.
     * This method is called every game tick, so no object should be created inside this method
     *
     * @param dt a time delta between game ticks
     */
    update(dt) {
        this.animations.forEach(animation => animation.update(dt));
    }

    render() {
        throw new Error('Drawable is an abstract class. It should not be instantiated');
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
        this.drawCollisionRect = true;
    }

    update(dt) {
        super.update(dt);
        this.rect.update(this.x, this.y, this.image.width, this.image.height, this.collisionRectScale);
    }

    /**
     * Draw on the screen using canvas
     */
    render() {
        ctx.globalAlpha = this.alpha;

        if (this.scale === 1) {
            ctx.drawImage(this.image, this.x, this.y);
        } else {
            let scaledWidth = this.image.width * this.scale;
            let scaledHeight = this.image.height * this.scale;

            let scaledX = this.x + (this.image.width - scaledWidth) / 2;
            let scaledY = this.y + (this.image.height - scaledHeight) / 2;

            ctx.drawImage(this.image, scaledX, scaledY, scaledWidth, scaledHeight);
        }

        ctx.globalAlpha = 1;

        if (this.drawCollisionRect) {
            this.rect.drawCollisionBorder();
        }
    }
}

class LayerDrawable {
    constructor(drawables, mainImageIndex) {
        this.drawables = drawables;
        this.mainImageIndex = mainImageIndex;
    }

    get image() {
        return this.drawables[this.mainImageIndex].image;
    }

    get rect() {
        return this.drawables[this.mainImageIndex].rect;
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

    addLayerAnimation(index, animation) {
        this.drawables[index].addAnimation(animation);
    }

    removeLayerAnimation(index, animation) {
        this.drawables[index].removeAnimation(animation);
    }

    addAnimation(animation) {
        this.drawables.forEach(drawable => drawable.addAnimation(animation));
    }

    removeAnimation(animation) {
        this.drawables.forEach(drawable => drawable.removeAnimation(animation));
    }
}

class RadialGradientDrawable extends Drawable {
    constructor(x, y, diameter) {
        super(x, y);
        this.diameter = diameter;
        this.gradientRadius = diameter;
    }

    render() {
        let centerX = this.x + this.diameter / 2;
        let centerY = this.y + this.diameter / 2;

        let r = this.gradientRadius * this.scale;
        this.gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
        this.gradient.addColorStop(0, 'rgba(255, 165, 0, 1)');
        this.gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');

        ctx.fillStyle = this.gradient;
        ctx.fillRect(centerX - r, centerY - r, centerX + r, centerY + r);
    }
}

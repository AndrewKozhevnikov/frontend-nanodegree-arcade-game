class RenderedObject {
    constructor(x, y) {
        this.setCoordinates(x, y);
        this.alpha = 1;
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
        if (this.animation == null) {
            return;
        }

        if (this.animation instanceof SlideUpAnimation || this.animation instanceof SlideUpDownAnimation) {
            this.yOffset = this.animation.update(dt);
        } else if (this.animation instanceof FadeOutAnimation) {
            this.alphaOffset = this.animation.update(dt);
        }
    }

    update(dt) {
        this.applyAnimation(dt);

        this.x = this.x;
        this.y = this.y + this.yOffset;

        if (this.alpha <= 0.15) { // sometimes alpha will revert
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

    render() {
        let lines = this.text.split('\n');

        for (let i = 0; i < lines.length; i++) {
            engine.fillText(lines[i], this.x, this.y + (i * this.lineHeight), this.textStyle);
        }
    }
}

class RenderedShadowText extends RenderedText {

}

class RenderedImage extends RenderedObject {
    constructor(sprite, x, y){
        super(x, y);
        this.sprite = sprite;
    }

    render() {
        if (this.sprite == null) {
            return;
        }

        if (this.alphaOffset !== 0) {
            this.renderWithAlpha();
        } else {
            ctx.drawImage(res.get(this.sprite), this.x, this.y);
        }
    }

    renderWithAlpha() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(res.get(this.sprite), this.x, this.y);
        ctx.restore();
    }
}
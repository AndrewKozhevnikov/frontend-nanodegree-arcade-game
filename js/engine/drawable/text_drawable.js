/**
 * Renders text
 */
class TextDrawable {
    constructor(text, left, top, fillStyle, font) {
        this.setText(text);
        this.left = left;
        this.top = top;
        this.fillStyle = fillStyle;
        this.font = font;

        this.animations = [];

        this.lineHeight = 15; // todo how to calculate text height?
    }

    resetAnimations() {
        this.animations.forEach(animation => animation.reset());
    }

    addAnimation(animation) {
        this.animations.push(animation);
    }

    removeAnimation(animation) {
        if (this.hasAnimation(animation)) {
            this.animations.remove(animation);
        }
    }

    hasAnimation(animation) {
        return this.animations.indexOf(animation) !== -1;
    }

    update(dt) {
        this.animations.forEach(animation => animation.update(dt));
    }

    setText(text) {
        this.text = text;
        this.lines = this.text.split('\n');
    }

    render() {
        for (let i = 0; i < this.lines.length; i++) {
            engine.fillText(this.lines[i], this.left, this.top + (i * this.lineHeight),
                this.fillStyle, this.font);
        }
    }
}
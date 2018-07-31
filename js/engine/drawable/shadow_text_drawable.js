class ShadowTextDrawable extends TextDrawable {
    constructor(text, left, top, strokeColor, lineWidth, fillStyle, font) {
        super(text, left, top, fillStyle, font);
        this.strokeStyle = {color: strokeColor, textAlign: fillStyle.textAlign, lineWidth: lineWidth};
    }

    setStrokeColor(color) {
        this.strokeStyle.color = color;
    }

    render() {
        for (let i = 0; i < this.lines.length; i++) {
            engine.strokeText(this.lines[i], this.left, this.top + (i * this.lineHeight),
                this.strokeStyle, this.font);
        }

        super.render();
    }
}
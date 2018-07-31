class RadialGradientDrawable extends BaseDrawable {
    constructor(rgbColor, left, top, radius) {
        super();
        this.rgb = this.getRGB(rgbColor);
        this.rgba_1 = `rgba(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]}, 1)`;
        this.rgba_2 = `rgba(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]}, 0)`;

        this.radius = radius;

        this._initRect(left, top, radius * 2, radius * 2);

        this.centerX = this.rect.left + this.radius;
        this.centerY = this.rect.top + this.radius;
    }

    getRGB(rgbColor) {
        rgbColor = rgbColor.substring(rgbColor.indexOf('(') + 1, rgbColor.indexOf(')'));
        return rgbColor.split(",");
    }

    render(parentRectLeft = 0, parentRectTop = 0) {
        let r = this.radius * this.scale;
        let centerX = this.centerX + parentRectLeft;
        let centerY = this.centerY + parentRectTop;

        let gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
        gradient.addColorStop(0, this.rgba_1);
        gradient.addColorStop(1, this.rgba_2);

        ctx.fillStyle = gradient;
        ctx.fillRect(this.rect.left + parentRectLeft, this.rect.top + parentRectTop, this.rect.width, this.rect.height);
    }
}
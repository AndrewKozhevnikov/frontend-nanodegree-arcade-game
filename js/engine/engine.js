/**
 * Class provides the game gameLoop functionality (update and render game objects).
 * Class provides some utility methods to draw smth on canvas like #strokeText(...) and #showDialog(...)
 */
class Engine {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        document.body.appendChild(this.canvas);
    }

    getCanvasContext() {
        return this.ctx;
    }

    /**
     * Start game loop
     */
    start() {
        this.stopped = false;
        this.lastTime = Date.now();
        this.gameLoop();
    }

    /**
     * Stop game loop
     */
    stop() {
        this.stopped = true;
    }

    /**
     * Update & render game objects
     */
    gameLoop() {
        if (this.stopped) {
            return;
        }

        const now = Date.now();
        const dt = (now - this.lastTime) / 1000.0;

        this.update(dt);
        this.render();

        this.lastTime = now;

        window.requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Update game objects.
     * This method is called every game tick, so no object should be created inside this method
     *
     * @param dt a time delta between game ticks
     * @see #gameLoop()
     */
    update(dt) {
        game.update(dt);
    }

    /**
     * Clear canvas.
     * Then draw game objects.
     * This method is called every game tick, so no object should be created inside this method
     *
     * @see #gameLoop()
     */
    render() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        game.render();
    }

    /**
     * Utility method with some default parameters.
     * Parameters text, x, y are required
     */
    strokeText(text, x, y, {font = '24px Arial', strokeStyle = '#FFFFFF', lineWidth = 3, textAlign = 'x'} = {}) {
        ctx.font = font;
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.textAlign = textAlign;
        ctx.strokeText(text, x, y);
    }

    /**
     * Utility method with some default parameters.
     * Parameters text, x, y are required
     */
    fillText(text, x, y, {font = '24px Arial', fillStyle = '#000000', textAlign = 'x'} = {}) {
        ctx.font = font;
        ctx.fillStyle = fillStyle;
        ctx.textAlign = textAlign;
        ctx.fillText(text, x, y);
    }

    /**
     * Stroke text.
     * Then fill the same text.
     * This will affect text to look like it has border
     */
    strokeAndFillText(text, x, y,
                      {
                          font = '24px Arial', fillStyle = '#000000', strokeStyle = '#FFFFFF',
                          lineWidth = 3, textAlign = 'left'
                      } = {}) {
        this.strokeText(text, x, y, {font, strokeStyle, lineWidth, textAlign});
        this.fillText(text, x, y, {font, fillStyle, textAlign});
    }

    /**
     * Draw border rectangle
     */
    stroke(left, top, right, bottom, {strokeStyle = '#000000', lineWidth = 1} = {}) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.moveTo(left, top);
        ctx.lineTo(right, top);
        ctx.lineTo(right, bottom);
        ctx.lineTo(left, bottom);
        ctx.closePath();
        ctx.stroke();
    }

    /**
     * Draw rectangle with some text.
     * This will look like a dialog
     *
     * @param title
     * @param msg
     */
    showDialog(title, msg) {
        let width = 350;
        let height = 200;
        let left = (canvasWidth - width) / 2;
        let top = (canvasHeight - height) / 2;
        let hCenter = left + width / 2;
        let vCenter = top + height / 2;

        ctx.fillStyle = 'rgba(27, 27, 27, 0.8)';
        ctx.fillRect(left, top, width, height);

        this.fillText(title.toUpperCase(), hCenter, vCenter - 30,
            {font: '40px Arial', fillStyle: '#FEFC36', textAlign: 'center'});

        this.fillText(msg, hCenter, vCenter + 40,
            {fillStyle: '#FFFFFF', textAlign: 'center'});
    }
}

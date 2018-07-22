class RenderedObject {
    constructor(engine) {
        this.engine = engine;
    }

    render() {
    }
}

class RenderedText extends RenderedObject {
    constructor(engine, text, x, y, {font, fillStyle, textAlign}) {
        super(engine);
        this.text = text;
        this.x = x;
        this.y = y;
        this.textStyle = {font, fillStyle, textAlign};
    }

    render() {
        this.engine.fillText(this.text, this.x, this.y, this.textStyle);
    }
}

/**
 * Class provides the game gameLoop functionality (update and render game objects).
 * Class provides some utility methods to draw smth on canvas like #strokeText(...) and #showDialog(...)
 */
class Engine {
    constructor(game) {
        this.game = game;
        game.setEngine(this);

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 505;
        this.canvas.height = 606;
        document.body.appendChild(this.canvas);

        this.renderedObjects = [];
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
        this.game.update(dt);
    }

    /**
     * Clear canvas.
     * Then draw game objects.
     * This method is called every game tick, so no object should be created inside this method
     *
     * @see #gameLoop()
     */
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.game.render();
    }

    /**
     * Utility method with some default parameters.
     * Parameters text, x, y are required
     */
    strokeText(text, x, y, {font = '24px Arial', strokeStyle = '#FFFFFF', lineWidth = 3, textAlign = 'left'} = {}) {
        this.ctx.font = font;
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.lineWidth = lineWidth;
        this.ctx.textAlign = textAlign;
        this.ctx.strokeText(text, x, y);
    }

    /**
     * Utility method with some default parameters.
     * Parameters text, x, y are required
     */
    fillText(text, x, y, {font = '24px Arial', fillStyle = '#000000', textAlign = 'left'} = {}) {
        this.ctx.font = font;
        this.ctx.fillStyle = fillStyle;
        this.ctx.textAlign = textAlign;
        this.ctx.fillText(text, x, y);
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
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.lineWidth = lineWidth;

        this.ctx.beginPath();
        this.ctx.moveTo(left, top);
        this.ctx.lineTo(right, top);
        this.ctx.lineTo(right, bottom);
        this.ctx.lineTo(left, bottom);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    /**
     * Draw rectangle with some text.
     * This will look like dialog
     *
     * @param title
     * @param msg
     */
    showDialog(title, msg) {
        let width = 350;
        let height = 200;
        let left = (this.canvas.width - width) / 2;
        let top = (this.canvas.height - height) / 2;
        let hCenter = left + width / 2;
        let vCenter = top + height / 2;

        this.ctx.fillStyle = 'rgba(27, 27, 27, 0.8)';
        this.ctx.fillRect(left, top, width, height);

        this.fillText(title.toUpperCase(), hCenter, vCenter - 30,
            {font: '40px Arial', fillStyle: '#FEFC36', textAlign: 'center'});

        this.fillText(msg, hCenter, vCenter + 40,
            {fillStyle: '#FFFFFF', textAlign: 'center'});
    }
}

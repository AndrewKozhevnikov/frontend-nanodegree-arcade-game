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

        this.fps = 0;
        this.fpsString = 'fps: ' + parseInt(this.fps);
        this.timer = new Timer();
        this.timer.addEventListener('secondsUpdated', () => {
            this.fpsString = 'fps: ' + parseInt(this.fps);
        });
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
        this.timer.start();
        this.gameLoop();
    }

    /**
     * Stop game loop
     */
    stop() {
        this.stopped = true;
        this.timer.stop();
    }

    /**
     * Update & render game objects
     */
    gameLoop() {
        if (this.stopped) {
            return;
        }

        let now = Date.now();
        let dt = (now - this.lastTime) / 1000.0;
        this.fps = 1 / dt;
        // if (this.fps < 55) {
        //     throw new Error('Performance issue');
        // }

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

        this.fillText(this.fpsString, canvasWidth - 10, 40, {color: '#FFFFFF', textAlign: 'right'});
    }

    /**
     * Utility method with some default parameters.
     * Parameters text, left, top are required
     */
    strokeText(text, left, top,
               {color = '#FFFFFF', textAlign = 'left', lineWidth = 3} = {},
               {fontWeight = '', fontSize = '24', fontFamily = 'Arial'} = {}) {

        if (fontWeight.length > 0) fontWeight += ' ';
        ctx.font = fontWeight + fontSize + 'px ' + fontFamily;
        ctx.strokeStyle = color;
        ctx.textAlign = textAlign;
        ctx.lineWidth = lineWidth;
        ctx.strokeText(text, left, top);
    }

    /**
     * Utility method with some default parameters.
     * Parameters text, left, top are required
     */
    fillText(text, left, top,
             {color = '#000000', textAlign = 'left'} = {},
             {fontWeight = '', fontSize = '24', fontFamily = 'Arial'} = {}) {

        if (fontWeight.length > 0) fontWeight += ' ';
        ctx.font = fontWeight + fontSize + 'px ' + fontFamily;
        ctx.fillStyle = color;
        ctx.textAlign = textAlign;
        ctx.fillText(text, left, top);
    }

    /**
     * Draw border rectangle
     */
    stroke(left, top, right, bottom, strokeColor = '#000000', lineWidth = 1) {
        ctx.strokeStyle = strokeColor;
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
            {color: '#FEFC36', textAlign: 'center'},
            {fontSize: '40'});

        this.fillText(msg, hCenter, vCenter + 40,
            {color: '#FFFFFF', textAlign: 'center'});
    }
}

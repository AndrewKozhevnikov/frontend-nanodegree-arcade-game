/**
 * Provide the game gameLoop functionality (update and render game objects).
 * Also provide utility methods to draw on canvas.
 */
class Engine {
    constructor() {
        // This background canvas will be redrawn very rarely unlike the game canvas
        this.bgCtx = this.createCanvasContext(1);

        this.ctx = this.createCanvasContext(2);

        this.fps = 0;
        this.fpsString = 'fps: ' + parseInt(this.fps);
        this.fpsTimer = new Timer();
        this.fpsTimer.addEventListener('secondsUpdated', () => {
            this.fpsString = 'fps: ' + parseInt(this.fps);
        });
    }

    /**
     * Create new canvas element. And return its context
     *
     * @param zIndex canvas z index
     * @returns CanvasRenderingContext2D canvas context
     */
    createCanvasContext(zIndex){
        let canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.zIndex = zIndex;

        let canvasContainer = document.querySelector('.container');
        canvasContainer.appendChild(canvas);

        return canvas.getContext('2d');
    }

    getCanvasContext() {
        return this.ctx;
    }

    start() {
        this.stopped = false;
        this.lastTime = Date.now();
        this.fpsTimer.start();
        this.gameLoop();
    }

    stop() {
        this.stopped = true;
        this.fpsTimer.stop();
    }

    /**
     * Main game loop.
     * Update & render game objects.
     * <p>
     * Do nothing, if the engine is stopped
     * <p>
     * This method is a performance bottleneck, it is called every game tick,
     * so no heavy object should be created inside this method
     */
    gameLoop() {
        if (this.stopped) {
            return;
        }

        let now = Date.now();
        let dt = (now - this.lastTime) / 1000.0;
        this.fps = 1 / dt;

        this.update(dt);
        this.render();

        this.lastTime = now;

        window.requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Update game objects according to the time delta
     * Any game object speed should be multiplied by the dt.
     * This will ensure the game runs at the same speed for all computers.
     *
     * @param dt time delta between game ticks
     */
    update(dt) {
        game.update(dt);
    }

    /**
     * Clear canvas and then render the game.
     */
    render() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        game.render();

        this.fillText(this.fpsString, canvasWidth - 10, 40, {color: '#FFFFFF', textAlign: 'right'});
    }

    /**
     * Clear background canvas
     */
    clearBgCanvas() {
        this.bgCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    /**
     * Stroke text
     *
     * @param text text to render
     * @param left left text coordinate
     * @param top top text coordinate
     * @param {color, textAlign, lineWidth} strokeStyle stroke style
     * @param {fontWeight, fontSize, fontFamily} fontStyle font style
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
     * Fill text
     *
     * @param text text to render
     * @param left left text coordinate
     * @param top top text coordinate
     * @param {color, textAlign} fillStyle fill style
     * @param {fontWeight, fontSize, fontFamily} fontStyle font style
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
     * Render rectangle with border
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
     * @param title title
     * @param msg message
     * @param centerVertical whether to center dialog vertically or not
     * @param alpha dialog alpha
     */
    showDialog(title, msg, centerVertical = true, alpha = 0.8) {
        let width = 350;
        let height = centerVertical ? 200 : 150;
        let left = (canvasWidth - width) / 2;
        let top = centerVertical ? ((canvasHeight - height) / 2) : (canvasHeight - height - 120);
        let hCenter = left + width / 2;
        let vCenter = top + height / 2;

        ctx.fillStyle = `rgba(27, 27, 27, ${alpha})`;
        ctx.fillRect(left, top, width, height);

        let titleXOffset = centerVertical ? 30 : 20;
        this.fillText(title.toUpperCase(), hCenter, vCenter - titleXOffset,
            {color: '#FEFC36', textAlign: 'center'},
            {fontSize: '40'});

        this.fillText(msg, hCenter, vCenter + 40,
            {color: '#FFFFFF', textAlign: 'center'});
    }
}

class PauseBottomMessage extends TextDrawable {
    constructor() {
        super('Press \'p\' to pause or resume', canvasWidth - 10, canvasHeight - 26,
            {color: '#FFFFFF', textAlign: 'right'},
            {fontSize: '18'});
    }

    reset() {
    }
}
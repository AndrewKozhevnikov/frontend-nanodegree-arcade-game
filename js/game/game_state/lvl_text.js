class LvlText extends ShadowTextDrawable {
    constructor() {
        super('Lvl: 1', canvasWidth - 20, 90, '#000000', 3,
            {color: '#FEFC36', textAlign: 'right'},
            {fontWeight: 'bold'});
        this.lvl = 1;
    }

    increaseLvl() {
        this.lvl++;
        this.setText('Lvl: ' + this.lvl);
    }

    reset() {
        this.lvl = 1;
        this.setText('Lvl: ' + this.lvl);
    }
}
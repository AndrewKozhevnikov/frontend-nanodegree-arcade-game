class Level_5 extends BaseLevel {
    constructor(player) {
        super(player, 'SharkEnemy');
        this.reset();
    }

    resetLevelObjects() {
        let octopus = new EmptyBarrier();

        let charWidth = res.get('img/char_horn_girl_sad.png').width;
        let offset = charWidth - 35;
        let charsDrawables = [
            new ImageDrawable(res.get('img/char_horn_girl_sad.png'), 3 * colWidth + 10, 3 * rowHeight + 35),
            new ImageDrawable(res.get('img/char_cat_girl_sad.png'), 3 * colWidth + offset + 10, 3 * rowHeight + 35),
            new ImageDrawable(res.get('img/char_pink_girl_sad.png'), 3 * colWidth + 2 * offset + 10, 3 * rowHeight + 35),
            new ImageDrawable(res.get('img/char_princess_girl_sad.png'), 3 * colWidth + 3 * offset + 10, 3 * rowHeight + 35)
        ];
        this.capturedChars = new LayerLevelObject(charsDrawables, 0, false, false, new Bonus()); // todo empty bonus

        this.levelObjects = [
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, this.capturedChars, octopus],
            [null, null, null, octopus, octopus],
            [null, null, octopus, octopus, octopus]
        ];

        // this.setLevelObjectsCoordinates();
        // this.capturedChars.setCoordinates(3 * colWidth + 10, 3 * rowHeight + 35);
        // let animation = new ForwardBackAnimation(this.capturedChars, 'y', 12, this.capturedChars.y, this.capturedChars.y + 8); // ?
        // this.capturedChars.addAnimation(animation);
    }

    isWaterLevel() {
        return true;
    }

    render() {
        let bg = res.get('img/background_scene_underwater.jpg');
        let octo = res.get('img/octopus.png');
        ctx.drawImage(bg, 0, transparentPartOfTileImage);
        this.allEnemies.forEach(enemy => enemy.render());
        ctx.drawImage(octo, canvasWidth - octo.width, bg.height - octo.height + transparentPartOfTileImage - 50);

        this.capturedChars.render();
        // todo start from here
        // this.callLevelObjectsMethod('render');
        this.player.render();
        this.additionalRenderObjects.forEach(obj => obj.render());

        ctx.fillStyle = 'rgba(102, 102, 204, 0.3)';
        ctx.fillRect(0, transparentPartOfTileImage, bg.width, bg.height);
    }
}

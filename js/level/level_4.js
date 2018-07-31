class Level_4 extends BaseLevel {
    constructor(player) {
        super(player, 'SharkFinEnemy');
        this.rowImages = [
            'img/tile_water.png',
            'img/tile_water.png',
            'img/tile_water.png',
            'img/tile_water.png',
            'img/tile_water.png',
            'img/tile_water.png'
        ];

        this.levelScheme = [
            ['buoyLeftAway', 'buoyRightAway', 'buoyLeftAway', null, 'buoyRightAway'],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            ['bottle', 'empty', null, 'empty', null],
            [null, 'buoyRight', null, 'buoyLeft', null]
        ];

        this.submergedImage = res.get('img/submerged.png');

        this.reset();
    }

    render() {
        this.renderTiles();
        this.callLevelObjectsMethod('render');
        this.player.render();
        this.renderWater();
        this.allEnemies.forEach(enemy => enemy.render());
        this.renderFarSea();
        this.additionalRenderObjects.forEach(obj => obj.render());
    }

    isWaterLevel() {
        return true;
    }

    renderWater() {
        let bottleRow = 4;
        let bottleX = 0;
        let bottleY = bottleRow * rowHeight + nextRowVisibleTop - this.submergedImage.height;

        let playerX = this.player.col * colWidth;
        let playerY = this.player.row * rowHeight + nextRowVisibleTop - this.submergedImage.height;

        ctx.save();
        ctx.globalAlpha = 0.6;
        if (this.levelObjects[bottleRow][0] != null) {
            ctx.drawImage(this.submergedImage, bottleX, bottleY);
        }
        ctx.drawImage(this.submergedImage, playerX, playerY);
        ctx.restore();
    }

    renderFarSea() {
        // make far sea darker
        let alpha = 0.4;
        for (let row = 0; row < rows; row++) {
            ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
            ctx.fillRect(0, row * rowHeight + transparentPartOfTileImage, canvasWidth, rowHeight);
            alpha -= 0.08;
        }
    }
}
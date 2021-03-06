class Level_6 extends BaseLevel {
    constructor(player) {
        super(player, 'SeagullEnemy');
        this.rowImages = [
            'img/tile_sand.png',
            'img/tile_sand.png',
            'img/tile_sand.png',
            'img/tile_sand.png',
            'img/tile_sand.png',
            'img/tile_shore.png'
        ];

        this.levelScheme = [
            ['tree', 'rock', 'chest', 'tree', 'tree'],
            ['key', 'rock', null, null, null],
            [null, null, 'rock', null, null],
            ['rock', null, null, 'heart', null],
            [null, null, null, null, null],
            [null, null, null, null, null]
        ];

        this.reset();
    }

    render() {
        this.callLevelObjectsMethod('render');
        this.player.render();
        this.allEnemies.forEach(enemy => enemy.render());
        this.additionalRenderObjects.forEach(obj => obj.render());

        if (this.showWinDialog) {
            engine.showDialog('You Did It!', 'Press \'Enter\' to Play Again', false, 0.5);
        }
    }
}
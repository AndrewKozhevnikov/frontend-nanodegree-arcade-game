class Level_2 extends BaseLevel {
    constructor(player) {
        super(player, 'BugEnemy');
        this.rowImages = [
            'img/tile_water.png',
            'img/tile_stone.png',
            'img/tile_stone.png',
            'img/tile_stone.png',
            'img/tile_grass.png',
            'img/tile_grass.png'
        ];

        this.levelScheme = [
            ['fence', 'fence', 'fence', null, null],
            [null, 'gem', null, null, null],
            [null, null, null, null, null],
            [null, null, null, 'heart', null],
            [null, null, null, null, null],
            [null, null, null, null, null]
        ];

        this.reset();
    }
}
class Level_3 extends BaseLevel {
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
            [null, null, null, null, 'fence'],
            [null, 'rock', null, 'rock', 'gem'],
            ['rock', null, null, 'rock', null],
            [null, null, 'rock', null, null],
            [null, null, null, null, null],
            [null, null, null, null, null]
        ];

        this.reset();
    }
}
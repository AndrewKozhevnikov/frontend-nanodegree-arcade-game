Array.prototype.remove = function (element) {
    this.splice(this.indexOf(element), 1);
    return this;
};

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// When all images are loaded - start the game
const res = new Resources();
res.addOnImagesLoadedCallback(() => {
    // make some global variables to have easier access to them
    this.canvasWidth = 505;
    this.canvasHeight = 606;

    this.cols = 5;
    this.rows = 6;

    // these depend on tile images
    this.transparentPartOfTileImage = 50;
    this.undergroundPartOfTileImage = 50;

    this.colWidth = 101;
    this.rowHeight = (this.canvasHeight - transparentPartOfTileImage - undergroundPartOfTileImage) / rows;

    this.nextRowVisibleTop = transparentPartOfTileImage + rowHeight;


    this.engine = new Engine();
    this.ctx = engine.getCanvasContext();
    this.game = new Game();

    engine.start();
});

res.load([
    'img/background.gif',
    'img/background_scene_underwater.jpg',

    'img/tile_grass.png',
    'img/tile_stone.png',
    'img/tile_water.png',
    'img/tile_sand.png',
    'img/tile_shore.png',

    'img/bottle.png',
    'img/bubble.png',
    'img/submerged.png',

    'img/buoy_left.png',
    'img/buoy_left_away.png',
    'img/buoy_right.png',
    'img/buoy_right_away.png',

    'img/char_boy.png',
    'img/char_boy_happy.png',
    'img/char_boy_sad.png',
    'img/char_cat_girl.png',
    'img/char_cat_girl_sad.png',
    'img/char_horn_girl.png',
    'img/char_horn_girl_sad.png',
    'img/char_pink_girl.png',
    'img/char_pink_girl_sad.png',
    'img/char_princess_girl.png',
    'img/char_princess_girl_sad.png',

    'img/empty_pixel.png',

    'img/enemy_bug.png',
    'img/enemy_shark.png',
    'img/enemy_shark_fin.png',
    'img/enemy_shark_fin_revert.png',

    'img/seagull_0.png',
    'img/seagull_1.png',
    'img/seagull_2.png',
    'img/seagull_3.png',
    'img/seagull_4.png',
    'img/seagull_5.png',
    'img/seagull_6.png',
    'img/seagull_7.png',
    'img/seagull_loose_life.png',

    'img/fence.png',
    'img/tree.png',
    'img/gem_orange.png',
    'img/heart.png',
    'img/heart_lives_status.png',
    'img/heart_mini.png',
    'img/key.png',
    'img/octopus.png',
    'img/rock.png',
    'img/scroll.png',

    'img/treasure_chest.png',
    'img/treasure_chest_opened.png'
]);

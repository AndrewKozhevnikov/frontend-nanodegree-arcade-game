Array.prototype.remove = function (element) {
    this.splice(this.indexOf(element), 1);
    return this;
};

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const res = new Resources();
res.addOnImagesLoadedCallback(() => {
    this.engine = new Engine();
    this.ctx = engine.getCanvasContext();
    this.game = new Game();

    engine.start();
});

res.load([
    'img/background.gif',
    'img/background_scene_underwater.jpg',

    'img/block_grass.png',
    'img/block_stone.png',
    'img/block_water.png',

    'img/bottle.png',

    'img/bubble.png',

    'img/buoy_left.png',
    'img/buoy_left_away.png',
    'img/buoy_right.png',
    'img/buoy_right_away.png',

    'img/char_boy.png',
    'img/char_boy_sad.png',
    'img/char_cat_girl.png',
    'img/char_horn_girl.png',
    'img/char_pink_girl.png',
    'img/char_princess_girl.png',

    'img/enemy_bug.png',
    'img/enemy_shark_fin.png',
    'img/enemy_shark_fin_revert.png',

    'img/fence.png',

    'img/gem_blue.png',
    'img/gem_green.png',
    'img/gem_orange.png',

    'img/heart.png',
    'img/heart_mini.png',

    'img/key.png',
    'img/octopus.png',
    'img/rock.png',
    'img/scroll.png',

    'img/selector.png',
    'img/star.png',

    'img/submerged.png'
]);

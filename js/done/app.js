const res = new Resources();
res.load([
    'img/background.gif',

    'img/block_grass.png',
    'img/block_stone.png',
    'img/block_water.png',

    'img/bubble.png',

    'img/buoy_left.png',
    'img/buoy_right.png',
    'img/buoy_away_left.png',
    'img/buoy_away_right.png',

    'img/char_boy.png',
    'img/char_boy_sad.png',
    'img/char_cat_girl.png',
    'img/char_horn_girl.png',
    'img/char_pink_girl.png',
    'img/char_princess_girl.png',

    'img/enemy_bug.png',

    'img/fence.png',

    'img/gem_blue.png',
    'img/gem_green.png',
    'img/gem_orange.png',

    'img/heart.png',
    'img/heart_mini.png',

    'img/key.png',
    'img/rock.png',

    'img/selector.png',
    'img/star.png'
]);

res.addOnImagesLoadedCallback(() => {
    new Engine(new Game())
        .start();
});

class LevelObjectImageFactory {
    static getImageUrl(objectType) {
        this.imageUrls = {
            empty: 'img/empty_pixel.png',
            fence: 'img/fence.png',
            rock: 'img/rock.png',
            tree: 'img/tree.png',
            buoyLeftAway: 'img/buoy_left_away.png',
            buoyRightAway: 'img/buoy_right_away.png',
            buoyLeft: 'img/buoy_left.png',
            buoyRight: 'img/buoy_right.png',
            key: 'img/key.png',
            chest: 'img/treasure_chest.png',
            heart: 'img/heart.png',
            bottle: 'img/bottle.png',
            gem: 'img/gem_orange.png'
        };

        return this.imageUrls[objectType];
    }
}
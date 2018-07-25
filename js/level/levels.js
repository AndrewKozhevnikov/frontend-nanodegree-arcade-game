class Level {
    constructor(enemyClassName) {
        this.allEnemies = [];
        this.rowImages = [];
        this.levelObjects = null; // 2 dimensional array

        this.initEnemies(enemyClassName);
    }

    initEnemies(className) {
        const EnemyClass = EnemyFactory.getClassByName(className);

        for (let row = 1; row <= 3; row++) {
            const enemy = new EnemyClass();
            // todo refactor remove nextRowVisibleTop
            const y = row * rowHeight + nextRowVisibleTop - enemy.image.height - (rowHeight - enemy.image.height) / 2;
            enemy.setCoordinates(0, y);
            this.allEnemies.push(enemy);
        }
    }

    isWaterLevel() {
        return false;
    }

    render() {
        this.renderTiles();
        this.renderLevelObjects();
        this.allEnemies.forEach(enemy => enemy.render());
    }

    update(dt) {
        this.allEnemies.forEach(enemy => enemy.update(dt));

        if (this.levelObjects == null) {
            return;
        }

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let obj = this.levelObjects[row][col];
                if (obj != null) {
                    obj.update(dt);
                }
            }
        }
    }

    reset() {
        this.resetLevelObjects();
        this.allEnemies.forEach(enemy => enemy.resetPosition());
    }

    /**
     * method to override
     */
    resetLevelObjects() {
        this.levelObjects = null;
    }

    setLevelObjectsCoordinates() {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let obj = this.levelObjects[row][col];
                if (obj != null && obj.image != null) {
                    // place image at the tile center
                    const x = col * colWidth + (colWidth - obj.image.width) / 2;
                    const y = row * rowHeight + nextRowVisibleTop - obj.image.height - (rowHeight - obj.image.height) / 2;
                    obj.setCoordinates(x, y);
                }
            }
        }
    }

    /**
     * Check if player's rect collides with some enemy's rect
     *
     * @returns {boolean}
     */
    collideWithEnemy(playerRect) {
        for (let i = 0; i < this.allEnemies.length; i++) {
            if (playerRect.collidesWith(this.allEnemies[i].rect)) {
                return true;
            }
        }

        return false;
    }

    canPass(row, col) {
        if (this.levelObjects == null) {
            return true;
        }

        let obj = this.levelObjects[row][col];
        if (obj != null && !obj.passable) {
            return false;
        }

        return true;
    }

    canCollectItem(row, col) {
        if (this.levelObjects == null) {
            return false;
        }

        let obj = this.levelObjects[row][col];
        return (obj != null && obj.collectible);
    }

    collectItem(row, col) {
        let obj = this.levelObjects[row][col];
        let bonus = obj.bonus;
        this.levelObjects[row][col] = null;

        return bonus;
    }

    canWinLevel() {
        return true;
    }

    /**
     * Draw all currentLevel tiles
     */
    renderTiles() {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (this.rowImages[row]) {
                    ctx.drawImage(res.get(this.rowImages[row]), col * colWidth, row * rowHeight);
                }
            }
        }
    }

    renderLevelObjects() {
        if (this.levelObjects == null) {
            return;
        }

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let obj = this.levelObjects[row][col];
                if (obj != null) {
                    obj.render();
                }
            }
        }
    }

    renderForeground() {
    }
}

class Level_1 extends Level {
    constructor() {
        super('BugEnemy');
        this.rowImages = [
            'img/tile_water.png',
            'img/tile_stone.png',
            'img/tile_stone.png',
            'img/tile_stone.png',
            'img/tile_grass.png',
            'img/tile_grass.png'
        ];
    }
}

class Level_2 extends Level {
    constructor() {
        super('BugEnemy');
        this.rowImages = [
            'img/tile_water.png',
            'img/tile_stone.png',
            'img/tile_stone.png',
            'img/tile_stone.png',
            'img/tile_grass.png',
            'img/tile_grass.png'
        ];

        this.reset();
    }

    resetLevelObjects() {
        let fence_1 = new LevelObject('img/fence.png', false, false);
        let fence_2 = new LevelObject('img/fence.png', false, false);
        let fence_3 = new LevelObject('img/fence.png', false, false);
        let gem = new LevelObject('img/gem_orange.png', true, true, new Bonus({bonusScore: 500}));
        let heart = new LevelObject('img/heart.png', true, true, new Bonus({bonusLives: 1, bonusScore: 100}));

        // we could use the same object in different positions to increase performance
        // but if we use different instances we can apply different effects to these instances
        // for example one heart can fade in/out and another one can scale up/down at the same time
        this.levelObjects = [
            [fence_1, fence_2, fence_3, null, null],
            [null, gem, null, null, null],
            [null, null, null, null, null],
            [null, null, null, heart, null],
            [null, null, null, null, null],
            [null, null, null, null, null]
        ];

        this.setLevelObjectsCoordinates();

        // set precise coordinates
        fence_1.setCoordinates(fence_1.x, fence_1.y + 20);
        fence_2.setCoordinates(fence_2.x, fence_2.y + 20);
        fence_3.setCoordinates(fence_3.x, fence_3.y + 20);
    }
}

class Level_3 extends Level {
    constructor() {
        super('BugEnemy');
        this.rowImages = [
            'img/tile_water.png',
            'img/tile_stone.png',
            'img/tile_stone.png',
            'img/tile_stone.png',
            'img/tile_grass.png',
            'img/tile_grass.png'
        ];

        this.reset();
    }

    resetLevelObjects() {
        let fence = new LevelObject('img/fence.png', false, false);
        let rock_1 = new LevelObject('img/rock.png', false, false);
        let rock_2 = new LevelObject('img/rock.png', false, false);
        let rock_3 = new LevelObject('img/rock.png', false, false);
        let rock_4 = new LevelObject('img/rock.png', false, false);
        let rock_5 = new LevelObject('img/rock.png', false, false);
        let gem = new LevelObject('img/gem_orange.png', true, true, new Bonus({bonusScore: 100}));

        this.levelObjects = [
            [null, null, null, null, fence],
            [null, rock_1, null, rock_2, gem],
            [rock_3, null, null, rock_4, null],
            [null, null, rock_5, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null]
        ];

        this.setLevelObjectsCoordinates();

        fence.setCoordinates(fence.x, fence.y + 20);
    }
}

class Level_4 extends Level {
    constructor() {
        super('SharkFinEnemy');
        this.rowImages = [
            'img/tile_water.png',
            'img/tile_water.png',
            'img/tile_water.png',
            'img/tile_water.png',
            'img/tile_water.png',
            'img/tile_water.png'
        ];

        this.reset();
    }

    isWaterLevel() {
        return true;
    }

    resetLevelObjects() {
        let buoyLeftAway_1 = new LevelObject('img/buoy_left_away.png', false, false);
        let buoyLeftAway_2 = new LevelObject('img/buoy_left_away.png', false, false);
        let buoyRightAway_1 = new LevelObject('img/buoy_right_away.png', false, false);
        let buoyRightAway_2 = new LevelObject('img/buoy_right_away.png', false, false);

        let buoyLeft = new LevelObject('img/buoy_left.png', false, false);
        let buoyRight = new LevelObject('img/buoy_right.png', false, false);

        let emptyBarrier = new EmptyBarrier();

        let animation = new MoveUpDownAnimation();
        let bottle = new LevelObject('img/bottle.png', true, true, new ScrollBonus({bonusScore: 100}));
        bottle.setAnimation(animation);

        this.levelObjects = [
            [buoyLeftAway_1, buoyRightAway_1, buoyLeftAway_2, null, buoyRightAway_2],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [bottle, emptyBarrier, null, emptyBarrier, null],
            [null, buoyRight, null, buoyLeft, null]
        ];

        this.setLevelObjectsCoordinates();

        buoyLeft.setCoordinates(buoyLeft.x, buoyLeft.y -50);
        buoyRight.setCoordinates(buoyRight.x, buoyRight.y -30);
    }

    canWinLevel() {
        let winCondition = this.levelObjects[4][0] == null;
        return winCondition;
    }

// todo implement
    // render() {
    //     super.render();
    //     this.renderForeground();
    // }
    //
    // renderForeground() {
    //     // '#566DD6'
    //     ctx.drawImage(res.get('img/submerged.png'), 0, 5 * 83);
    // }
}

class Level_5 extends Level {
    constructor() {
        super('SharkEnemy');
        this.reset();
    }

    resetLevelObjects() {
        let octopus = new LevelObject(null, false, false);
        // let capturedChars = new LevelObject(null, false, false);

        this.levelObjects = [
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, octopus, octopus],
            [null, null, null, octopus, octopus],
            [null, null, octopus, octopus, octopus]
        ];

        this.setLevelObjectsCoordinates();
    }

    isWaterLevel() {
        return true;
    }

    render() {
        let bg = res.get('img/background_scene_underwater.jpg');
        let octo = res.get('img/octopus.png');
        ctx.drawImage(bg, 0, transparentPartOfTileImage);
        this.allEnemies.forEach(enemy => enemy.render());
        ctx.drawImage(octo, canvasWidth - octo.width, bg.height - octo.height + transparentPartOfTileImage);

        // todo start from here drawSadChars (1 object)
    }

    renderForeground() {
    }
}

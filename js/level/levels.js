class Level {
    constructor(player, enemyClassName) {
        this.player = player;
        this.allEnemies = [];
        this.rowImages = [];
        this.levelObjects = null; // 2 dimensional array

        this.initEnemies(enemyClassName);
    }

    initEnemies(className) {
        const EnemyClass = EnemyFactory.getClassByName(className);

        for (let row = 1; row <= 3; row++) {
            const enemy = new EnemyClass();
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

        this.allEnemies.forEach(enemy => {
            if (this.collideWithLevelObject(enemy) && enemy instanceof BugEnemy && !enemy.isJumping()) {
                enemy.jump();
            }
        });
    }

    // todo name looks awful. refactor // intersect, cross, crosses
    collideWithLevelObject(enemy) {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let obj = this.levelObjects[row][col];
                if (obj != null && enemy.rect.collidesWith(obj.rect)) {
                    return true;
                }
            }
        }

        return false;
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
    }
}

class Level_2 extends Level {
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

        this.reset();
    }

    resetLevelObjects() {
        let fence_1 = new LevelObject('img/fence.png', false, false);
        let fence_2 = new LevelObject('img/fence.png', false, false);
        let fence_3 = new LevelObject('img/fence.png', false, false);

        let gemImage = res.get('img/gem_orange.png');
        let size = Math.max(gemImage.width, gemImage.height);
        let gradientDrawable = new RadialGradientDrawable(0, 0, size);
        let gemDrawables = [
            gradientDrawable,
            new ImageDrawable('img/gem_orange.png')
        ];
        let gem = new LayerLevelObject(gemDrawables, 1, true, true, new Bonus({bonusScore: 500}));
        gem.addLayerAnimation(0, new UpDownAnimator(gradientDrawable, 'scale', 0.6, 0.7, 1.1));

        let heart = new LevelObject('img/heart.png', true, true, new Bonus({bonusLives: 1, bonusScore: 100}));
        heart.addAnimation(new UpDownAnimator(heart, 'scale', 0.15, 0.9, 1));

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

        this.reset();
    }

    resetLevelObjects() {
        let fence = new LevelObject('img/fence.png', false, false);
        let rock_1 = new LevelObject('img/rock.png', false, false);
        let rock_2 = new LevelObject('img/rock.png', false, false);
        let rock_3 = new LevelObject('img/rock.png', false, false);
        let rock_4 = new LevelObject('img/rock.png', false, false);
        let rock_5 = new LevelObject('img/rock.png', false, false);

        let gemImage = res.get('img/gem_orange.png');
        let size = Math.max(gemImage.width, gemImage.height);
        let gradientDrawable = new RadialGradientDrawable(0, 0, size);
        let gemDrawables = [
            gradientDrawable,
            new ImageDrawable('img/gem_orange.png')
        ];
        let gem = new LayerLevelObject(gemDrawables, 1, true, true, new Bonus({bonusScore: 500}));
        gem.addLayerAnimation(0, new UpDownAnimator(gradientDrawable, 'scale', 0.6, 0.7, 1.1));

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

        this.submergedImage = res.get('img/submerged.png');

        this.reset();
    }

    render() {
        this.renderTiles();
        this.renderLevelObjects();
        this.renderWater();
        this.allEnemies.forEach(enemy => enemy.render());
    }

    renderTiles() {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (this.rowImages[row]) {
                    ctx.drawImage(res.get(this.rowImages[row]), col * colWidth, row * rowHeight);
                }
            }
        }
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

        let bottle = new LevelObject('img/bottle.png', true, true, new ScrollBonus({bonusScore: 100}));
        bottle.addAnimation(new UpDownAnimator(bottle, 'y', 10, -6, 0));

        this.levelObjects = [
            [buoyLeftAway_1, buoyRightAway_1, buoyLeftAway_2, null, buoyRightAway_2],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [bottle, emptyBarrier, null, emptyBarrier, null],
            [null, buoyRight, null, buoyLeft, null]
        ];

        this.setLevelObjectsCoordinates();

        buoyLeft.setCoordinates(buoyLeft.x, buoyLeft.y - 50);
        buoyRight.setCoordinates(buoyRight.x, buoyRight.y - 30);
    }

    canWinLevel() {
        let winCondition = this.levelObjects[4][0] == null;
        return winCondition;
    }

    // todo check
    renderWater() {
        let bottleRow = 4;
        let bottleX = 0;
        let bottleY = bottleRow * rowHeight + nextRowVisibleTop - this.submergedImage.height;

        let playerX = this.player.col * colWidth;
        let playerY = this.player.row * rowHeight + nextRowVisibleTop - this.submergedImage.height;

        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.drawImage(this.submergedImage, bottleX, bottleY);
        ctx.drawImage(this.submergedImage, playerX, playerY);
        ctx.restore();

        // make far sea darker
        let alpha = 0.15;
        for (let row = 0; row < rows; row++) {
            ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
            ctx.fillRect(0, row * rowHeight + transparentPartOfTileImage, canvasWidth, rowHeight);
            alpha -= 0.03;
        }
    }
}

class Level_5 extends Level {
    constructor(player) {
        super(player, 'SharkEnemy');
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

        // todo drawSadChars (1 object)
    }

    renderForeground() {
    }
}

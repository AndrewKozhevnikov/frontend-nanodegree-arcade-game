class Level {
    constructor() {
        this.allEnemies = [];
        this.rowImages = [];
        this.levelObjects = null; // 2 dimensional array
        this.rows = 6;
        this.cols = 5;
    }

    isWaterLevel() {
        return false;
    }

    render() {
        this.renderBackground();
        this.renderTiles();
        this.renderLevelObjects();
        this.allEnemies.forEach(enemy => enemy.render());
    }

    update(dt) {
        this.allEnemies.forEach(enemy => enemy.update(dt));

        if (this.levelObjects == null) {
            return;
        }

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                let obj = this.levelObjects[row][col];
                if (obj != null) {
                    obj.update(dt);
                }
            }
        }
    }

    reset() {
        this.resetLevelObjects();
        this.allEnemies.forEach(enemy => enemy.reset());
    }

    resetPositions() {
        this.allEnemies.forEach(enemy => enemy.resetPosition());
    }

    resetLevelObjects() {
        this.levelObjects = null;
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

    renderBackground() {
    }

    /**
     * Draw all currentLevel tiles
     */
    renderTiles() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.rowImages[row] != null) {
                    ctx.drawImage(res.get(this.rowImages[row]), col * 101, row * 83);
                }
            }
        }
    }

    renderLevelObjects() {
        if (this.levelObjects == null) {
            return;
        }

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                let obj = this.levelObjects[row][col];
                if (obj != null) {
                    obj.render(row, col);
                }
            }
        }
    }
}

class Level_1 extends Level {
    constructor() {
        super();
        this.rowImages = [
            'img/block_water.png',
            'img/block_stone.png',
            'img/block_stone.png',
            'img/block_stone.png',
            'img/block_grass.png',
            'img/block_grass.png'
        ];

        for (let i = 1; i <= 3; i++) {
            this.allEnemies.push(new BugEnemy(0.6));
        }
    }
}

class Level_2 extends Level {
    constructor() {
        super();
        this.rowImages = [
            'img/block_water.png',
            'img/block_stone.png',
            'img/block_stone.png',
            'img/block_stone.png',
            'img/block_grass.png',
            'img/block_grass.png'
        ];

        for (let i = 1; i <= 3; i++) {
            this.allEnemies.push(new BugEnemy(0.6));
        }

        this.reset();
    }

    resetLevelObjects() {
        let fence = new LevelObject('img/fence.png', false, false);
        let gem = new LevelObject('img/gem_orange.png', true, true, new Bonus({bonusScore: 100}));
        let heart = new LevelObject('img/heart.png', true, true, new Bonus({bonusLives: 1, bonusScore: 100}));

        this.levelObjects = [
            [fence, fence, fence, null, null],
            [null, gem, null, null, null],
            [null, null, null, null, null],
            [null, null, null, heart, null],
            [null, null, null, null, null],
            [null, null, null, null, null]
        ];
    }
}

class Level_3 extends Level {
    constructor() {
        super();
        this.rowImages = [
            'img/block_water.png',
            'img/block_stone.png',
            'img/block_stone.png',
            'img/block_stone.png',
            'img/block_grass.png',
            'img/block_grass.png'
        ];

        for (let i = 1; i <= 3; i++) {
            this.allEnemies.push(new BugEnemy(0.6));
        }

        this.reset();
    }

    resetLevelObjects() {
        let fence = new LevelObject('img/fence.png', false, false);
        let rock = new LevelObject('img/rock.png', false, false);
        let gem = new LevelObject('img/gem_orange.png', true, true, new Bonus({bonusScore: 100}));

        this.levelObjects = [
            [null, null, null, null, fence],
            [null, rock, null, rock, gem],
            [rock, null, null, rock, null],
            [null, null, rock, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null]
        ];
    }
}

class Level_4 extends Level {
    constructor() {
        super();
        this.rowImages = [
            'img/block_water.png',
            'img/block_water.png',
            'img/block_water.png',
            'img/block_water.png',
            'img/block_water.png',
            'img/block_water.png'
        ];

        for (let i = 1; i <= 3; i++) {
            this.allEnemies.push(new SharkFinEnemy(0.8, i));
        }

        this.reset();
    }

    isWaterLevel() {
        return true;
    }

    resetLevelObjects() {
        let buoyLeftAway = new LevelObject('img/buoy_left_away.png', false, false);
        let buoyRightAway = new LevelObject('img/buoy_right_away.png', false, false);

        let buoyLeft = new LevelObject('img/buoy_left.png', false, false);
        buoyLeft.setYOffset(-70);
        let buoyRight = new LevelObject('img/buoy_right.png', false, false);
        buoyRight.setYOffset(-50);

        let emptyBarrier = new LevelObject(null, false, false);

        let slideUpDown = new SlideUpDownAnimation();
        let bottle = new LevelObject('img/bottle.png', true, true, new ScrollBonus({bonusScore: 100}), slideUpDown);

        this.levelObjects = [
            [buoyLeftAway, buoyRightAway, buoyLeftAway, null, buoyRightAway],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [bottle, emptyBarrier, null, emptyBarrier, null],
            [null, buoyRight, null, buoyLeft, null]
        ];
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
        super();

        // for (let i = 1; i <= 3; i++) {
        //     this.allEnemies.push(new BugEnemy(0.6));
        // }

        this.reset();
    }

    resetLevelObjects() {
        let octopus = new LevelObject(null, false, false);

        this.levelObjects = [
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, octopus, octopus],
            [null, null, null, octopus, octopus],
            [null, null, octopus, octopus, octopus]
        ];
    }

    renderBackground() {
        let bg = res.get('img/background_scene_underwater.jpg');
        let octopus = res.get('img/octopus.png');
        ctx.drawImage(bg, 0, 40);
        ctx.drawImage(octopus, engine.canvas.width - octopus.width, engine.canvas.height - octopus.height - 40);
    }
}

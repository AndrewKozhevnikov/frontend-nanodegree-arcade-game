class LevelObject {
    constructor(sprite, passable, collectible, bonus) {
        this.sprite = sprite;
        this.passable = passable;
        this.collectible = collectible;
        this.bonus = bonus;
    }
}

class Bonus {
    constructor({bonusScore = 0, bonusLives = 0} = {}) {
        this.bonusScore = bonusScore;
        this.bonusLives = bonusLives;
    }

    getBonusText() {
        let text = ``;

        if (this.bonusScore > 0) text += `+ ${this.bonusScore} Score<br>`;

        if (this.bonusLives === 1) {
            text += `+ ${this.bonusLives} Life`;
        } else if (this.bonusLives > 1) {
            text += `+ ${this.bonusLives} Lives`;
        }

        return text;
    }
}

class Level {
    constructor(game) {
        this.game = game;
        this.allEnemies = [];
        this.rowImages = [];
        this.levelObjects = null; // 2 dimensional array
        this.rows = 6;
        this.cols = 5;
    }

    render() {
        this.renderTiles();
        this.renderLevelObjects();
        this.allEnemies.forEach(enemy => enemy.render());
    }

    update(dt) {
        this.allEnemies.forEach(enemy => enemy.update(dt));
    }

    reset() {
        this.allEnemies.forEach(element => element.reset());
    }

    resetPositions() {
        this.allEnemies.forEach(element => element.resetPosition());
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

    /**
     * Draw all currentLevel tiles
     */
    renderTiles() {
        const ctx = this.game.engine.ctx;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                ctx.drawImage(res.get(this.rowImages[row]), col * 101, row * 83);
            }
        }
    }

    renderLevelObjects() {
        if (this.levelObjects == null) {
            return;
        }

        const ctx = this.game.engine.ctx;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                let obj = this.levelObjects[row][col];
                if (obj != null) {
                    ctx.drawImage(res.get(obj.sprite), col * 101, 83 + (row * 83) - 30);
                }
            }
        }
    }
}

class Level_1 extends Level {
    constructor(game) {
        super(game);
        this.rowImages = [
            'img/block_water.png',
            'img/block_stone.png',
            'img/block_stone.png',
            'img/block_stone.png',
            'img/block_grass.png',
            'img/block_grass.png'
        ];

        // for (let i = 1; i <= 3; i++) {
        //     this.allEnemies.push(new Enemy(this.game, 'img/enemy_bug.png', 98, 77, 0.6));
        // }
    }
}

class Level_2 extends Level {
    constructor(game) {
        super(game);
        this.rowImages = [
            'img/block_water.png',
            'img/block_stone.png',
            'img/block_stone.png',
            'img/block_stone.png',
            'img/block_grass.png',
            'img/block_grass.png'
        ];

        this.initLevelObjects();

        // for (let i = 1; i <= 3; i++) {
        //     this.allEnemies.push(new Enemy(this.game, 'img/enemy_bug.png', 98, 77, 0.6));
        // }
    }

    reset() {
        super.reset();
        this.initLevelObjects();
    }

    initLevelObjects() {
        let fence_1 = new LevelObject('img/fence.png', false, false);
        let fence_2 = new LevelObject('img/fence.png', false, false);
        let fence_3 = new LevelObject('img/fence.png', false, false);
        let gem = new LevelObject('img/gem_orange.png', true, true, new Bonus({bonusScore: 100}));
        let heart = new LevelObject('img/heart.png', true, true, new Bonus({bonusLives: 1}));

        this.levelObjects = [
            [fence_1, fence_2, fence_3, null, null],
            [null, gem, null, null, null],
            [null, null, null, null, null],
            [null, null, null, heart, null],
            [null, null, null, null, null],
            [null, null, null, null, null]
        ];
    }
}
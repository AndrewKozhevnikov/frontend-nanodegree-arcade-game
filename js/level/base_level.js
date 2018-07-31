class BaseLevel {
    constructor(player, enemyClassName) {
        this.player = player;
        this.allEnemies = [];
        this.rowImages = [];
        this.additionalRenderObjects = new Map();

        this.initEnemies(enemyClassName);

        this.levelScheme = [
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null]
        ];

        this.levelObjects = [
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null]
        ];
    }

    createLevelObject(objectType, row, col) {
        let obj;

        let imageUrl = LevelObjectImageFactory.getImageUrl(objectType);
        let image = res.get(imageUrl);

        let left = col * colWidth + (colWidth - image.width) / 2;
        let top = row * rowHeight + nextRowVisibleTop - image.height - (rowHeight - image.height) / 2;

        switch (objectType) {
            case 'empty':
                obj = new EmptyBarrier();
                break;
            case 'fence':
            case 'rock':
            case 'buoyLeftAway':
            case 'buoyRightAway':
            case 'buoyLeft':
            case 'buoyRight':
                obj = new LevelObject(image, left, top, false, false);
                break;
            case 'heart':
                obj = new LevelObject(image, left, top, true, true, new Bonus({bonusLives: 1, bonusScore: 100}));
                obj.addAnimation(new ForwardBackAnimation(obj.drawable, 'scale', 0.15, 0.9, 1));
                break;
            case 'bottle':
                obj = new LevelObject(image, left, top, true, true, new ScrollBonus({bonusScore: 100}));
                obj.addAnimation(new ForwardBackAnimation(obj.rect, 'top', 10, obj.rect.top - 6, obj.rect.top));
                break;
            case 'gem':
                let radius = Math.max(image.width, image.height);
                let gradient = new RadialGradientDrawable('rgb(255, 165, 0)', 0, 0, radius);
                gradient.addAnimation(new ForwardBackAnimation(gradient, 'scale', 0.5, 0.7, 1));
                let gem = new ImageDrawable(image, radius - image.width / 2, radius - image.height / 2);

                left = col * colWidth + (colWidth - radius * 2) / 2;
                top = row * rowHeight + nextRowVisibleTop - radius * 2 - (rowHeight - radius * 2) / 2; // todo looks
                // ugly

                obj = new LayerLevelObject([gradient, gem], left, top, radius * 2, radius * 2,
                    true, true, new Bonus({bonusScore: 500}));
                break;
            default:
                throw new Error('Unknown LevelObject type');
        }

        return obj;
    }

    // todo
    // buoyLeft.updateRectCoordinates(buoyLeft.rect.left, buoyLeft.rect.top - 50);
    // buoyRight.updateRectCoordinates(buoyRight.rect.left, buoyRight.rect.top - 30);

    resetLevelObjects() {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let objectType = this.levelScheme[row][col];
                if (objectType != null) {
                    this.levelObjects[row][col] = this.createLevelObject(objectType, row, col);
                } else {
                    this.levelObjects[row][col] = null;
                }
            }
        }
    }

    initLevel() {
        this.player.reset(5, 2, this.isWaterLevel());
    }

    initEnemies(className) {
        let EnemyClass = EnemyFactory.getClassByName(className);
        let imageUrl = EnemyImageFactory.getImageUrl(className);
        let image = res.get(imageUrl);

        for (let row = 1; row <= 3; row++) {
            let top = row * rowHeight + nextRowVisibleTop - image.height - (rowHeight - image.height) / 2;
            let enemy = new EnemyClass(image, 0, top);
            this.allEnemies.push(enemy);
        }
    }

    isWaterLevel() {
        return false;
    }

    render() {
        this.renderTiles(); //todo  move to initialization
        this.callLevelObjectsMethod('render');
        this.allEnemies.forEach(enemy => enemy.render());
        this.player.render();
        this.additionalRenderObjects.forEach(obj => obj.render());
    }

    update(dt) {
        this.allEnemies.forEach(enemy => enemy.update(dt));
        this.player.update(dt);
        this.additionalRenderObjects.forEach(obj => obj.update(dt));

        if (this.levelObjects != null) {
            this.callLevelObjectsMethod('update', dt);
            this.checkEnemyCollisions();
        }

        if (this.collideWithEnemy(this.player.rect) && game.isRunning()) {
            this.looseLife();
        }
    }

    callLevelObjectsMethod(methodName) {
        if (this.levelObjects == null) {
            return;
        }

        let args = Array.prototype.slice.call(arguments, 1);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let obj = this.levelObjects[row][col];
                if (obj != null) {
                    obj[methodName](args);
                }
            }
        }
    }

    checkEnemyCollisions() {
        this.allEnemies.forEach(enemy => {
            if (this.collideWithLevelObject(enemy) && enemy instanceof BugEnemy && !enemy.isJumping()) {
                enemy.jump();
            }
        });
    }

    looseLife() {
        this.player.setState(this.player.STATE_SAD);
        game.setGameState(game.STATE_LOOSING_LIFE);
        game.setPause(true);

        setTimeout(() => {
            this.player.setState(this.player.STATE_NORMAL);
            game.setGameState(game.STATE_NORMAL);
            if (!game.gameLost) {
                this.player.changePositionOnBoard(5, 2);
            }
            game.setPause(false);
        }, 400);
    }

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
        this.player.reset();
        this.additionalRenderObjects = new Map();
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
     * method to override
     */
    canWinLevel() {
        return true;
    }

    /**
     * Draw all currentLevel tiles
     */
    // todo render on bg ctx
    renderTiles() {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (this.rowImages[row] != null) {
                    ctx.drawImage(res.get(this.rowImages[row]), col * colWidth, row * rowHeight);
                }
            }
        }
    }

    showBonusText(text, left, top) {
        let bonusText = new TextDrawable(text, left, top,
            {color: '#321156', textAlign: 'center'},
            {fontWeight: 'bold', fontSize: '18'});
        let animation = new LinearAnimation(bonusText, 'top', 150, bonusText.top, bonusText.top - rowHeight);
        animation.setOnAnimationEndCallback(() => this.additionalRenderObjects.delete('bonusText'));
        bonusText.addAnimation(animation);
        this.additionalRenderObjects.set('bonusText', bonusText);
    }

    showScroll(left, top) {
        let scroll = new ImageDrawable(res.get('img/scroll.png'), left, top);
        this.additionalRenderObjects.set('scroll', scroll);

        setTimeout(() => {

            let fadeOutTime = 1000;
            scroll.addAnimation(new LinearAnimation(scroll.rect, 'alpha', 1, 1, 0));
            setTimeout(() => {
                this.additionalRenderObjects.delete('scroll');
            }, fadeOutTime);

        }, 3000);
    }

    handleInput(keyCode) {
        let allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        // remove any messages if user does not want to read them
        if (this.additionalRenderObjects.has('msg')) {
            this.additionalRenderObjects.delete('msg');
        }

        let row = this.player.row;
        let col = this.player.col;

        switch (allowedKeys[keyCode]) {
            case 'left':
                if ((col - 1 >= 0) && this.canPass(row, col - 1)) {
                    this.player.col--;
                }
                break;
            case 'right':
                if ((col + 1 <= 4) && this.canPass(row, col + 1)) {
                    this.player.col++;
                }
                break;
            case 'up':
                if ((row - 1 >= 0) && this.canPass(row - 1, col)) {
                    this.player.row--;
                }
                if (this.player.row === 0 && this.canWinLevel()) {
                    game.winLevel();
                }
                break;
            case 'down':
                if ((row + 1 <= 5) && this.canPass(row + 1, col)) {
                    this.player.row++;
                }
                break;
        }

        this.player.changePositionOnBoard(this.player.row, this.player.col);
        this.player.update(0);

        if (this.canCollectItem(this.player.row, this.player.col)) {
            let bonus = this.collectItem(this.player.row, this.player.col);
            game.addBonus(bonus);

            this.showBonusText(bonus.getBonusText(), this.player.rect.centerX, this.player.rect.top);

            if (bonus instanceof ScrollBonus) {
                this.showScroll(this.player.rect.right + 10, this.player.rect.top - this.player.rect.height);
            }
        }
    }
}

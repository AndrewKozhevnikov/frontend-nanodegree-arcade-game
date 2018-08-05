class BaseLevel {
    constructor(player, enemyClassName) {
        this.player = player;
        this.allEnemies = [];
        this.rowImages = [];
        this.additionalRenderObjects = new Map();

        this.enemyClassName = enemyClassName;
        this.enemyCount = (this instanceof Level_6) ? 4 : 3;

        this.showWinDialog = false;

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
            case 'tree':
            case 'buoyLeftAway':
            case 'buoyRightAway':
                obj = new LevelObject(image, left, top, false, false);
                break;
            case 'buoyLeft':
                obj = new LevelObject(image, left, top - 50, false, false);
                break;
            case 'buoyRight':
                obj = new LevelObject(image, left, top - 30, false, false);
                break;
            case 'key':
                obj = new LevelObject(image, left, top, true, false, null, true);
                break;
            case 'chest':
                obj = new TreasureChest(image, left, top, false, false);
                break;
            case 'heart':
                obj = new LevelObject(image, left, top, true, true, new Bonus({bonusLives: 1, bonusScore: 100}));
                obj.addAnimation(new ForwardBackAnimation(obj.drawable, 'scale', 0.15, 0.7, 0.8));
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
                top = row * rowHeight + nextRowVisibleTop - radius * 2 - (rowHeight - radius * 2) / 2;

                obj = new LayerLevelObject([gradient, gem], left, top, radius * 2, radius * 2,
                    true, true, new Bonus({bonusScore: 500}), 0.6);
                break;
            default:
                throw new Error('Unknown LevelObject type');
        }

        return obj;
    }

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
        this.renderBackground();

        let row = this.isUnderWaterLevel() ? 0 : 5;
        let col = this.isUnderWaterLevel() ? 0 : 2;
        this.player.reset(this, row, col);
        this.showWinDialog = false;

        if (this.allEnemies.length === 0) {
            this.initEnemies(this.enemyClassName, this.enemyCount);
        }
    }

    initEnemies(className, enemyCount = 3) {
        let EnemyClass = EnemyFactory.getClassByName(className);
        let imageUrl = EnemyImageFactory.getImageUrl(className);
        let image = res.get(imageUrl);

        for (let row = 1; row <= enemyCount; row++) {
            let top = row * rowHeight + nextRowVisibleTop - image.height - (rowHeight - image.height) / 2;
            let enemy = new EnemyClass(image, 0, top);
            this.allEnemies.push(enemy);
        }
    }

    isWaterLevel() {
        return false;
    }

    isUnderWaterLevel() {
        return false;
    }

    render() {
        this.callLevelObjectsMethod('render');
        this.allEnemies.forEach(enemy => enemy.render());
        this.player.render();
        this.additionalRenderObjects.forEach(obj => obj.render());

        if (this.showWinDialog) {
            engine.showDialog('You Did It!', 'Press \'Enter\' to Play Again', false, 0.5);
        }
    }

    update(dt) {
        this.allEnemies.forEach(enemy => enemy.update(dt));
        this.player.update(dt);
        this.additionalRenderObjects.forEach(obj => obj.update(dt));

        if (this.levelObjects != null) {
            this.callLevelObjectsMethod('update', dt);
            this.checkEnemyCollisions();
        }

        if (this.player.currentState !== this.player.STATE_FALLING && game.isRunning()) {
            let enemy = this.getIntersectedEnemy(this.player.rect);
            if (enemy != null) {
                this.looseLife();

                if (enemy instanceof SeagullEnemy) {
                    enemy.setState(enemy.STATE_FALLING);
                }
            }
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
        let playerCurrentState = this.player.currentState;
        this.player.setState(this.player.STATE_SAD);
        game.setGameState(game.STATE_LOOSING_LIFE);
        game.setPause(true);

        setTimeout(() => {
            this.player.setState(playerCurrentState);
            game.setGameState(game.STATE_NORMAL);
            if (!game.gameLost) {
                let row = 5;
                let col = this.isUnderWaterLevel() ? 0 : 2;
                this.player.changePositionOnBoard(row, col);
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
        this.player.reset(this);
        this.additionalRenderObjects = new Map();
    }

    getIntersectedEnemy(playerRect) {
        let enemy;
        for (let i = 0; i < this.allEnemies.length; i++) {
            enemy = this.allEnemies[i];
            if (playerRect.collidesWith(enemy.rect)) {
                if (enemy instanceof SeagullEnemy && enemy.currentState === enemy.STATE_FALLING) {
                    // do nothing because falling seagull cannot do harm
                } else {
                    return enemy;
                }
            }
        }

        return null;
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

    canCarryItem(row, col) {
        if (this.levelObjects == null) {
            return false;
        }

        let obj = this.levelObjects[row][col];
        return (obj != null && obj.wearable);
    }

    collectItem(row, col) {
        let obj = this.levelObjects[row][col];
        let bonus = obj.bonus;
        this.levelObjects[row][col] = null;

        return bonus;
    }

    /**
     * Draw background on its own canvas.
     * This method should be called only from #initLevel()
     */
    renderBackground() {
        engine.clearBgCanvas();

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (this.rowImages[row] != null) {
                    engine.bgCtx.drawImage(res.get(this.rowImages[row]), col * colWidth, row * rowHeight);
                }
            }
        }
    }

    showBonusFloatingText(text, left, top) {
        let bonusText = new TextDrawable(text, left, top,
            {color: '#321156', textAlign: 'center'},
            {fontWeight: 'bold', fontSize: '18'});
        let animation = new LinearAnimation(bonusText, 'top', 150, bonusText.top, bonusText.top - rowHeight);
        animation.setOnAnimationEndCallback(() => this.additionalRenderObjects.delete('bonusText'));
        bonusText.addAnimation(animation);
        this.additionalRenderObjects.set('bonusText', bonusText);
    }

    showScrollWithText(left, top) {
        let scroll = new ImageDrawable(res.get('img/scroll.png'), left, top);
        this.additionalRenderObjects.set('scroll', scroll);

        setTimeout(() => {

            let fadeOutTime = 1000;
            scroll.addAnimation(new LinearAnimation(scroll, 'alpha', 1, 1, 0));
            setTimeout(() => {
                this.additionalRenderObjects.delete('scroll');
            }, fadeOutTime);

        }, 3000);
    }

    winGame() {
        game.gameWon = true;
        this.showWinDialog = true;
        this.player.setState(this.player.STATE_HAPPY);
        this.allEnemies = [];

        this.showHappyChars();
        this.showFlyingHearts();
    }

    showHappyChars() {
        let charWidth = res.get('img/char_horn_girl.png').width;
        let offsetX = 40;
        let offsetY = charWidth + 20;
        let charsDrawables = [
            new ImageDrawable(res.get('img/char_horn_girl.png'), 0, 0),
            new ImageDrawable(res.get('img/char_cat_girl.png'), offsetY, offsetX),
            new ImageDrawable(res.get('img/char_pink_girl.png'), 2 * offsetY, offsetX),
            new ImageDrawable(res.get('img/char_princess_girl.png'), 3 * offsetY, 0)
        ];
        let lastChar = charsDrawables[3];
        let lastButOneChar = charsDrawables[2];

        // set precise position
        let width = lastChar.rect.right;
        let height = lastButOneChar.rect.bottom;
        let left = (canvasWidth - width) / 2;
        let top = (canvasHeight - height) / 2 - 20;
        let chars = new LayerLevelObject(charsDrawables, left, top, width, height, false, false);

        let animation = new ForwardBackAnimation(chars.rect, 'top', 110, chars.rect.top, chars.rect.top - 50);
        chars.addAnimation(animation);
        this.additionalRenderObjects.set('chars', chars);
    }

    showFlyingHearts() {
        let heartImage = res.get('img/heart_mini.png');
        for (let i = 0; i < 7; i++) {
            let left = random(50, canvasWidth - 50);
            let top = random(50, canvasHeight - 150);
            let speed = random(100, 200);
            let heart = new ImageDrawable(heartImage, left, top);

            let shakeAnimation = new ForwardBackAnimation(heart.rect, 'left', speed, left - 50, left + 50);

            let animation = new LinearAnimation(heart.rect, 'top', speed, heart.rect.top, 0);
            animation.setOnAnimationEndCallback(() => {
                left = random(50, canvasWidth - 50);
                top = random(50, canvasHeight - 150);
                speed = random(100, 200);

                shakeAnimation.setValues(left - 50, left + 50);

                heart.updateRectCoordinates(left, top);
                animation.setValues(heart.rect.top, 0);
                animation.speed = speed;
                animation.reset();
            });
            heart.addAnimation(animation);
            heart.addAnimation(shakeAnimation);

            this.additionalRenderObjects.set('heart_' + i, heart);
        }
    }

    handleKeyboardInput(keyCode) {
        let allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        if (this.player.currentState === this.player.STATE_FALLING ||
            this.player.currentState === this.player.STATE_TALKING) {
            return;
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
                if (this.levelObjects[row - 1][this.player.col] instanceof TreasureChest &&
                    this.player.carriedItem != null) {
                    this.levelObjects[row - 1][this.player.col].openChest();
                    this.winGame()
                } else if ((row - 1 >= 0) && this.canPass(row - 1, col)) {
                    this.player.row--;
                    if (this.player.row === 0) {
                        game.winLevel();
                    }
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

            this.showBonusFloatingText(bonus.getBonusText(), this.player.rect.centerX, this.player.rect.top);

            if (bonus instanceof ScrollBonus) {
                this.showScrollWithText(this.player.rect.right + 10, this.player.rect.top - this.player.rect.height);
            }
        } else if (this.canCarryItem(this.player.row, this.player.col)) {
            let item = this.levelObjects[this.player.row][this.player.col].drawable;
            this.levelObjects[this.player.row][this.player.col] = null;
            this.player.carry(item);
        }
    }
}

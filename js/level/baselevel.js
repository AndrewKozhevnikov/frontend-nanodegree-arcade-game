class BaseLevel {
    constructor(player, enemyClassName) {
        this.player = player;
        this.allEnemies = [];
        this.rowImages = [];
        this.levelObjects = null; // 2 dimensional array
        this.additionalRenderObjects = new Map();

        this.initEnemies(enemyClassName);
    }

    initLevel() {
        let animation = this.player.getSwimAnimation();
        if (this.isWaterLevel()) {
            this.player.addAnimation(animation);
        } else {
            this.player.removeAnimation(animation);
        }

        this.player.setPositionOnBoard(5, 2);
    }

    initEnemies(className) {
        const EnemyClass = EnemyFactory.getClassByName(className);

        // todo  EnemyClass.getImageUrl() =>
        // constructor params =>
        // remove enemy.setCoordinates(0, y);
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
        this.player.setImage(this.player.imageSad);
        game.setGameState(game.GAME_STATE_LOOSING_LIFE);
        game.setPause(true);

        setTimeout(() => {
            this.player.setImage(this.player.imageNormal);
            game.setGameState(game.GAME_STATE_NORMAL);
            if (!game.gameLost) {
                this.player.setPositionOnBoard(5, 2);
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

    /**
     * method to override
     */
    canWinLevel() {
        return true;
    }

    /**
     * Draw all currentLevel tiles
     */
    renderTiles() {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (this.rowImages[row] != null) {
                    ctx.drawImage(res.get(this.rowImages[row]), col * colWidth, row * rowHeight);
                }
            }
        }
    }

    showBonusText(text, x, y) {
        const bonusText = new TextDrawable(text, x, y, {font: 'bold 18px Arial', fillStyle: '#321156', textAlign: 'center'});
        let animation = new LinearAnimator(bonusText, 'y', 150, bonusText.y, bonusText.y - rowHeight);
        animation.setOnAnimationEndCallback(() => this.additionalRenderObjects.delete('bonusText'));
        bonusText.addAnimation(animation);
        this.additionalRenderObjects.set('bonusText', bonusText);
    }

    showScroll(x, y) {
        const scroll = new ImageDrawable('img/scroll.png', x, y);
        this.additionalRenderObjects.set('scroll', scroll);

        setTimeout(() => {

            let fadeOutTime = 1000;
            scroll.addAnimation(new FadeOutAnimation(fadeOutTime));
            setTimeout(() => {
                this.additionalRenderObjects.delete('scroll');
            }, fadeOutTime);

        }, 3000);
    }

    handleInput(keyCode) {
        const allowedKeys = {
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

        this.player.setPositionOnBoard(this.player.row, this.player.col);
        this.player.update(0);

        if (this.canCollectItem(this.player.row, this.player.col)) {
            let bonus = this.collectItem(this.player.row, this.player.col);
            game.addBonus(bonus);

            this.showBonusText(bonus.getBonusText(), this.player.rect.centerX, this.player.rect.y);

            if (bonus instanceof ScrollBonus) {
                this.showScroll(this.player.rect.right + 10, this.player.rect.y - this.player.rect.height);
            }
        }
    }
}

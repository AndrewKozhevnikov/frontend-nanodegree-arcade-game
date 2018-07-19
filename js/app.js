class Game {
    constructor() {
        this.player = new Player(this, 'img/char-boy.png', 67, 88, 0.4);
        this.allEnemies = [];
        for (let i = 1; i <= 3; i++) {
            this.allEnemies.push(new Enemy(this, 'img/enemy-bug.png', 98, 77, 0.4)); // make enemy a bit smaller for
            // comfort play
        }
    }

    reset() {
        // Engine.pause();
        // showDialog();
        this.allEnemies.forEach(element => element.reset());
        this.player.reset();
    }

    win() {

    }

    loose() {

    }
}

// Enemies our player must avoid
class Unit {
    constructor(game, sprite, width, height, collisionRectScale) {
        this.game = game;
        this.sprite = sprite;
        this.rect = new Rectangle(width, height, collisionRectScale);
        this.reset();
    }

    reset() {
        throw new Error('Cannot call abstract method');
    }

    update(dt) {
        throw new Error('Cannot call abstract method');
    }

    /**
     * Draw on the screen using canvas
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.rect.left, this.rect.top);
        this.rect.drawCollisionBorder();
    }
}

class Enemy extends Unit {
    reset() {
        // this.movement = getRandomInteger(200, 500);
        this.movement = getRandomInteger(100, 200);
        this.row = getRandomInteger(1, 3);
        let x = 0;
        let y = (171 / 2) * this.row + this.rect.height / 2;

        this.rect.update(x, y);
    }

    // Update position
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        let x = this.rect.left + this.movement * dt;
        if (x >= 505) {
            this.reset();
        } else {
            this.rect.update(x, this.rect.top);
        }
    }
}

class Player extends Unit {
    reset() {
        this.row = 5;
        this.col = 2;
    }

    update(dt) {
        let x = 101 * this.col + (101 - this.rect.width) / 2;
        let y = (171 / 2) * this.row + this.rect.height / 2;

        this.rect.update(x, y);
    }

    handleInput(key) {
        switch(key) {
            case 'left':
                if (--this.col < 0) this.col = 0;
                break;
            case 'right':
                if (++this.col >= 4) this.col = 4;
                break;
            case 'up':
                if (--this.row < 0) this.row = 0;
                if (this.row === 0) game.reset();
                break;
            case 'down':
                if (++this.row >= 5) this.row = 5;
                break;
        }
    }
}

let game = new Game();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    game.player.handleInput(allowedKeys[e.keyCode]);
});

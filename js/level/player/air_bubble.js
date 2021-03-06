/**
 * Air bubble for underwater level
 */
class AirBubble {
    constructor(player) {
        this.player = player;

        let left = random(this.player.rect.left + 10, this.player.rect.right - 10);
        let top = random(this.player.rect.top, this.player.rect.top + 40);
        let speed = random(70, 200);

        this.drawable = new ImageDrawable(res.get('img/bubble.png'), left, top, 1);

        this.runAnimation = new LinearAnimation(this.drawable.rect, 'top', speed, top, transparentPartOfTileImage);
        this.drawable.addAnimation(this.runAnimation);
    }

    render() {
        this.drawable.render();
    }

    update(dt) {
        this.drawable.update(dt);

        if (this.drawable.rect.top <= transparentPartOfTileImage) {
            this.resetPosition();
        }
    }

    resetPosition() {
        let left = random(this.player.rect.left + 10, this.player.rect.right - 10);
        let top = random(this.player.rect.top, this.player.rect.top + 40);
        let speed = random(70, 200);

        this.drawable.updateRectCoordinates(left, top);
        this.runAnimation.setValues(top, transparentPartOfTileImage);
        this.runAnimation.reset();
        this.runAnimation.speed = speed;
    }
}
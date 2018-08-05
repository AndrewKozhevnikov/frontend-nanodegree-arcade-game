/**
 * Just an empty, not passable object with no functionality at all
 */
class EmptyBarrier {
    constructor() {
        this.passable = false;
        this.collectible = false;
    }

    update(dt) {
    }

    render() {
    }

    updateRectCoordinates(left, top) {
    }
}
class TreasureChest extends LevelObject {
    constructor(image, left, top, passable, collectible, bonus, wearable) {
        super(image, left, top, passable, collectible, bonus, wearable);

        this.openedChestImage = res.get('img/treasure_chest_opened.png');
        this.closedChestImage = res.get('img/treasure_chest.png');
    }

    openChest() {
        this.drawable.setImage(this.openedChestImage);
    }

    reset() {
        this.drawable.setImage(this.closedChestImage);
    }
}
class EnemyImageFactory {
    static getImageUrl(className) {
        this.imageUrls = {
            BugEnemy: 'img/enemy_bug.png',
            SharkFinEnemy: 'img/enemy_shark_fin.png',
            SharkEnemy: 'img/enemy_shark.png',
            SeagullEnemy: 'img/seagull_0.png'
        };

        return this.imageUrls[className];
    }
}
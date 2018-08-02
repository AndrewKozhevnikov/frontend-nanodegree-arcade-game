class EnemyFactory {
    static getClassByName(name) {
        this.classes = {
            BugEnemy,
            SharkFinEnemy,
            SharkEnemy,
            SeagullEnemy
        };

        return this.classes[name];
    }
}
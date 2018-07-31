class EnemyFactory {
    static getClassByName(name) {
        this.classes = {
            BugEnemy,
            SharkFinEnemy,
            SharkEnemy
        };

        return this.classes[name];
    }
}
class Level_5 extends BaseLevel {
    constructor(player) {
        super(player, 'SharkEnemy');
        this.reset();
    }

    resetLevelObjects() {
        let octopus = new EmptyBarrier();

        let charWidth = res.get('img/char_horn_girl_sad.png').width;
        let offset = charWidth - 35;
        let charsDrawables = [
            new ImageDrawable(res.get('img/char_horn_girl_sad.png'), 0, 0),
            new ImageDrawable(res.get('img/char_cat_girl_sad.png'), offset, 0),
            new ImageDrawable(res.get('img/char_pink_girl_sad.png'), 2 * offset, 0),
            new ImageDrawable(res.get('img/char_princess_girl_sad.png'), 3 * offset, 0)
        ];
        let lastChar = charsDrawables[3];

        // set precise position
        let left = 3 * colWidth + 10;
        let top = 3 * rowHeight + 35;
        let width = lastChar.rect.right;
        let height = lastChar.rect.height;
        this.capturedChars = new LayerLevelObject(charsDrawables, left, top, width, height, false, false);

        let animation = new ForwardBackAnimation(this.capturedChars.rect, 'top', 12, this.capturedChars.rect.top, this.capturedChars.rect.top + 8);
        this.capturedChars.addAnimation(animation);

        this.levelObjects = [
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, this.capturedChars, octopus],
            [null, null, null, octopus, octopus],
            [null, null, octopus, octopus, octopus]
        ];
    }

    startDialog() {
        let playerMsgLeft = this.player.rect.right;
        let playerMsgTop = this.player.rect.top;
        let charsMsgLeft = this.capturedChars.rect.left - 160 - 10;
        let charsMsgTop = this.capturedChars.rect.top - 30;

        this.messages = [
            new SpeechBubble('...', playerMsgLeft, playerMsgTop, true),
            new SpeechBubble('What\'s wrong?', playerMsgLeft, playerMsgTop, true),
            new SpeechBubble('Evil Octopus is\nholding us captive.', charsMsgLeft, charsMsgTop, false),
            new SpeechBubble('He will let us go\nif someone opens\nthe treasure chest\nfor him.', charsMsgLeft, charsMsgTop, false),
            new SpeechBubble('Can you help us?', charsMsgLeft, charsMsgTop, false),
            new SpeechBubble('Sure. I can try.\nWhere is it?', playerMsgLeft, playerMsgTop, true),
            new SpeechBubble('It is on the Island.', charsMsgLeft, charsMsgTop, false),
            new SpeechBubble('Swim towards\nthe light to get\nto the shore.', charsMsgLeft, charsMsgTop, false),
            new SpeechBubble('Thank you.\nAnd good luck.', charsMsgLeft, charsMsgTop, false)
        ];

        // todo start
        this.messageIndex = 0;
        this.showNextMessage();

        // let speechBubble = new SpeechBubble(this.messages[0], 100, 100);
        // this.additionalRenderObjects.set('speechBubble', speechBubble);
    }

    showNextMessage() {
        let msg = this.messages[this.messageIndex];
        this.additionalRenderObjects.set('msg', msg);

        msg.setOnFinishedTypingCallback(() => {
            setTimeout(() => {
                this.additionalRenderObjects.delete('msg');
                if (++this.messageIndex < this.messages.length) {
                    this.showNextMessage();
                } else {
                    this.player.setState(this.player.STATE_UNDERWATER);
                }
            }, 1000);
        });

        msg.typeText();
    }

    // showNextMessage(msg) {
    //     let textDrawable = new TextDrawable('', this.player.rect.right + 10, this.player.rect.top, {},
    //         {fontWeight: '', fontSize: '18'});
    //     this.additionalRenderObjects.set('text', textDrawable);
    //
    //     this.typeText(textDrawable, msg, () => {
    //         setTimeout(() => {
    //             this.additionalRenderObjects.delete('text');
    //             if (++this.messageIndex < this.messages.length) {
    //                 this.showNextMessage(this.messages[this.messageIndex]);
    //             } else {
    //                 this.player.setState(this.player.STATE_UNDERWATER);
    //             }
    //         }, 1000);
    //     });
    // }
    //
    // typeText(textDrawable, text, onFinishedTypingCallback) {
    //     let i = 0;
    //
    //     function generateText() {
    //         setTimeout(function () {
    //             textDrawable.setText(textDrawable.text + text.charAt(i));
    //             if (++i !== text.length) {
    //                 generateText();
    //             } else {
    //                 onFinishedTypingCallback();
    //             }
    //         }, 60);
    //     }
    //
    //     generateText();
    // }

    isUnderWaterLevel() {
        return true;
    }

    render() {
        let bg = res.get('img/background_scene_underwater.jpg');
        let octo = res.get('img/octopus.png');
        ctx.drawImage(bg, 0, transparentPartOfTileImage);
        this.allEnemies.forEach(enemy => enemy.render());
        ctx.drawImage(octo, canvasWidth - octo.width, bg.height - octo.height + transparentPartOfTileImage - 60);

        this.capturedChars.render();
        this.player.render();
        this.additionalRenderObjects.forEach(obj => obj.render());

        ctx.fillStyle = 'rgba(102, 102, 204, 0.3)';
        ctx.fillRect(0, transparentPartOfTileImage, bg.width, bg.height);
    }
}

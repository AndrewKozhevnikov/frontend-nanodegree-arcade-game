class SpeechBubble {
    constructor(text, left, top, pointingToLeft) {
        this.text = text;
        this.lines = text.split('\n');
        this.left = left;
        this.top = top;
        this.pointingToLeft = pointingToLeft;
        this.drawable = new TextDrawable('', left + 10, top + 22, {}, {fontWeight: 'bold', fontSize: '16'});

        this.bubbleWidth = 160;
        this.bubbleHeight = this.lines.length * this.drawable.lineHeight + 20;
        this.radius = 16;
    }

    setOnFinishedTypingCallback(callback) {
        this.onFinishedTypingCallback = callback;
    }

    typeText() {
        this.i = 0;
        this.typeChars();
    }

    typeChars() {
        setTimeout(() => {
            this.drawable.setText(this.drawable.text + this.text.charAt(this.i));
            if (++this.i < this.text.length) {
                this.typeChars();
            } else {
                this.onFinishedTypingCallback();
            }
        }, 60);
    }

    render() {
        this.renderSpeechBubble(this.left, this.top, this.bubbleWidth, this.bubbleHeight, this.radius);
        this.drawable.render();
    }

    update(dt) {
    }

    renderSpeechBubble(left, top, width, height, radius) {
        let right = left + width;
        let bottom = top + height;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; // todo no alpha?
        ctx.strokeStyle = "#969696";
        ctx.lineWidth = "2";

        // upper left
        ctx.beginPath();
        ctx.moveTo(left + radius, top);

        // upper right
        ctx.lineTo(right - radius, top);
        ctx.quadraticCurveTo(right, top, right, top + radius);

        // lower right
        ctx.lineTo(right, top + height - radius);
        ctx.quadraticCurveTo(right, bottom, right - radius, bottom);

        // curve pointing out at talking person
        if (this.pointingToLeft) {
            ctx.lineTo(left + radius * 3, bottom);
            ctx.quadraticCurveTo(left + radius * 3, bottom + 15, left + 10, bottom + 15);
            ctx.quadraticCurveTo(left + radius * 2, bottom + 10, left + 10 + radius, bottom);
        } else {
            ctx.lineTo(right - 10 - radius, bottom);
            ctx.quadraticCurveTo(right - radius * 2, bottom + 10, right - 10, bottom + 15);
            ctx.quadraticCurveTo(right - radius * 3, bottom + 15, right - radius * 3, bottom);
        }

        // lower left
        ctx.lineTo(left + radius, bottom);
        ctx.quadraticCurveTo(left, bottom, left, bottom - radius);

        // upper left
        ctx.lineTo(left, top + radius);
        ctx.quadraticCurveTo(left, top, left + radius, top);

        ctx.fill();
        ctx.stroke();
    }
}


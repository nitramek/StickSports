var Model = {
    Character: function (img) {
        this.image = img;
        this.x = WIDTH - 231;
        this.y = 200;
        this.tilesCount = 11;
        this.tileX = 0;
        this.tileWidth = 231; //this.image.width / this.tilesCount;
        this.missDraw = 0;
        this.speed = 3;
        this.animate = false;
        this.doDraw = true;
        //this.
        this.draw = function (ctx) {
            //jestli je na obrazovce
            if (this.doDraw) {
                ctx.drawImage(this.image, this.tileX * this.tileWidth, 0, this.tileWidth, this.image.height,
                    this.x + translation, this.y, this.tileWidth, this.image.height);
                if (!Model.isVisible(this.x + translation, this.y)) {
                    this.doDraw = false;
                }
                if (this.animate) {
                    if (this.missDraw === 0) this.tileX++;
                    this.missDraw = (this.missDraw + 1) % this.speed;
                    this.tileX = this.tileX % this.tilesCount;
                    if (this.tileX == this.tilesCount - 1) { //animation ended
                        this.animate = false;

                    }
                    if (this.tileX > 9) {
                        gameState = STATE.hitting;
                    }
                }
            }
        }
    },
    Target: function (image) {
        this.image = image;
        this.x = WIDTH - 231;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.angle = 180;
        this.width = image.width / 2;
        this.height = image.height / 2;
        this.draw = function (ctx) {
            ctx.save();
            if (gameState == STATE.flying) {
                if (this.vy > 0) {//pada dolu
                    this.angle = 180 / Math.PI * Math.atan(Math.abs(this.vx) / Math.abs(this.vy)) + 180;
                } else {//stoupa
                    this.angle = 180 / Math.PI * Math.atan(Math.abs(this.vy) / Math.abs(this.vx)) + 270;
                }
            }
            ctx.translate(this.x + this.width / 2 + translation, this.y + this.height / 2); //presunout obrazek na centr panacka
            ctx.rotate(this.angle * Math.PI / 180); //otoceni
            ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height,
                -this.width / 2, -this.height / 2, this.width, this.height);//, this.image.width, this.image.height);
            ctx.restore();
            this.update();
        };
        this.update = function () {
            if (gameState == STATE.hitting && this.y >= HITBOX.upperBound && this.y <= HITBOX.lowerBound) {
                media.playSound('boom');
                var hitWidthInPercents = (this.y - HITBOX.upperBound) / HITBOX.lowerBound;
                this.vx = -5; //zacne letet vpravo
                this.vy = -10 * (1 - hitWidthInPercents);
                gameState = STATE.flying; //trefil se zacne letet
            }
            var decidingParameter = this.height;
            if (gameState == STATE.falling) {
                this.vy += GRAVITY;
            }
            if (gameState == STATE.flying) {
                translation -= this.vx;
                this.vy += GRAVITY;
            }
            if (this.y + decidingParameter >= gameObjects.background.ground.y) {
                gameState = STATE.gameOver;
            }
            if (this.vx != 0)
                score += 1;

            this.x += this.vx;
            this.y += this.vy;
        }


    },
    Mine: function (x) {
        this.x = x;
        this.y = gameObjects.background.ground.y;
        this.prototype.colorBackground = "#000000";
        this.prototype.colorHead = "#FF0000";
        this.prototype.width = 50;
        this.prototype.height = 20;
        this.visible = false;
        this.draw = function (ctx) {
            ctx.fillStyle = Model.Mine.colorBackground;
            ctx.fillRect(this.x, this.y, Model.Mine.width, Model.Mine.height);
            ctx.fillStyle = Model.Mine.colorHead;
            ctx.fillRect(this.x + Model.Mine.width - 10, this.y, 20, 5);
        };
    },
    isVisible: function (x, y) {
        return x >= 0 && x <= WIDTH && y >= 0 && y <= HEIGHT;
    }

};
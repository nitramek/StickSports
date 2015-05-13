const WIDTH = 800;
const HEIGHT = 480;
const STATE = {
    standing: 0,
    falling: 1,
    flying: 2,
    hitting: 3,
    gameOver: 4
};
var gameState;
const GRAVITY = 0.1;
var gameObjects;
var translation = 0;
var score = 0;
function init() {
    translation = 0;
    score = 0;
    var target;
    var character;
    gameState = STATE.standing;
    var targetImg = new Image();
    targetImg.src = 'assets/targetGuy.png';
    targetImg.addEventListener('load', function () {
        gameObjects['target'] = new Target(this);
    });
    var charImg = new Image();
    charImg.src = 'assets/spriteGuyAll.png';
    charImg.addEventListener('load', function () {
        gameObjects['character'] = new Character(this);
    });
    gameObjects = {
        background: {
            ground: {
                color: "#AAAAAA",
                x: 0,
                y: 350
            },
            draw: function (ctx) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, WIDTH, HEIGHT);
                ctx.fillStyle = this.ground.color;
                ctx.fillRect(this.ground.x, this.ground.y, WIDTH - this.ground.x, HEIGHT - this.ground.y);
            }

        }
    };
}


function onLoad() {
    init();
    var canvas = document.getElementById('canvas');
    var ctx = this.canvas.getContext('2d');

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    ctx['height'] = canvas.height;
    ctx['width'] = canvas.width;
    ctx.scale(canvas.width / WIDTH, canvas.height / HEIGHT);

    window.requestAnimationFrame(redraw);

    function redraw() {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        for (var objName in gameObjects) {
            //noinspection JSUnfilteredForInLoop
            var gameObject = gameObjects[objName];
            gameObject.draw(ctx);
        }
        drawScore(ctx);
        if (gameState == STATE.gameOver) {
            drawGameOver(ctx);
        }
        if (gameState != STATE.gameOver) {
            window.requestAnimationFrame(redraw);
        }
    }

}


function Character(img) {
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
            if (!(this.x + translation >= 0 && this.x + translation <= WIDTH)) {
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
}
function Target(image) {
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
            playSound(SOUNDS.boom);
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


}

const HITBOX = {
    upperBound: 140,
    lowerBound: 260
};
function drawGameOver(ctx) {
    var scores = getHighScores();
    var metrics = ctx.measureText('Game Over!');
    var textCoords = {x: WIDTH / 2 - metrics.width / 2, y: HEIGHT / 2 - 50 / 2};
    ctx.fillStyle = '#FF0000';
    ctx.font = '50px Arial bold';

    ctx.fillText('Game Over!', textCoords.x, textCoords.y);
    textCoords.y += 50;
    ctx.fillStyle = '#000000';
    ctx.font = '30px Arial';

    ctx.fillText('Your score: ' + score, textCoords.x, textCoords.y);
    textCoords.y += 30;
    if (scores.length == null) { //neni podpora lokal storage
        ctx.fillText('Highest scores is not supported', textCoords.x, textCoords.y);
    } else {
        ctx.font = '15px Arial';
        for (var i = 0; i < scores.length; i++) {
            var scoreItem = scores[i];
            var position = (i + 1);
            ctx.fillText(position + '. Score: ' + scoreItem, textCoords.x, textCoords.y);
            textCoords.y += 15;
        }

    }


}
const SCORE_KEY = "score";
function getHighScores() {
    var ls = window.localStorage;
    var scores = [];
    if (ls) {
        if (ls.getItem(SCORE_KEY)) scores = JSON.parse(ls.getItem(SCORE_KEY));
        scores.push(score);
        scores.sort(sortCmp);
        scores = scores.slice(0, 5); //top 5
        ls.setItem(SCORE_KEY, JSON.stringify(scores));
    }
    return scores;

}
function sortCmp(a, b) {
    return b - a;
}
function drawScore(ctx) {
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial bold';
    ctx.fillText('Score: ' + score, 0, 20);
}
function processInput() {
    switch (gameState) {
        case STATE.standing:
            gameObjects.target.vy = 1; //zacne padat
            gameState = STATE.falling;
            break;
        case STATE.falling:
            gameObjects.character.animate = true; //dalsi input, zacne se naprahovat palkou
            break;
        case STATE.gameOver:
            gameState = STATE.standing;
            onLoad();
    }

}

const SOUNDS = {
    boom: 0
};
function playSound(soundId) {
    switch (soundId) {
        case SOUNDS.boom:
            document.getElementById('boom').play();
            break;
    }
}


window.addEventListener('keydown', processInput);
window.addEventListener('touchend', processInput);
window.addEventListener('load', onLoad);
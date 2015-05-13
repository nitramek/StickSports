const WIDTH = 800;
const HEIGHT = 480;
const STATE = {
    standing: 0,
    falling: 1,
    flying: 2,
    hitting: 3,
    gameOver: 4
};

var media = {
    boom: {
        src: "assets/boom.mp3"
    },
    ouch: {
        src: "assets/ouch.mp3"
    },
    playSound: function (name) {
        if (typeof this[name].value == 'undefined') {
            this[name].value = new Media(this[name].src, afterPlay);
        }
        this[name].value.play();
        if (typeof device != 'undefined') {
            this[name].value.seekTo(0);
        }
    }

};
var gameState;
const GRAVITY = 0.1;
var gameObjects = {
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
var translation = 0;
var score = 0;
var ctx;

var Resources = {
    loadAudioDesktop: function () {
        if (typeof device == 'undefined') {
            for (var objName in media) {
                var oneMedia = media[objName];
                if (typeof oneMedia == 'object') {
                    oneMedia['value'] = new Audio(oneMedia.src);
                }
            }
        }
    },
    loadAudioCordova: function () {
        console.log('codovaAudioLoaded');
        if (typeof device != 'undefined') {
            for (var objName in media) {
                var oneMedia = media[objName];
                if (typeof oneMedia == 'object') {
                    if (device.platform == 'Android') {
                        oneMedia.src = '/android_asset/www/' + oneMedia.src;
                    }
                    oneMedia['value'] = new Media(oneMedia.src, afterPlay);
                }
            }
        }
    }
};

var Controller = {
    onLoad: function () {
        Resources.load();
        var canvas = document.getElementById('canvas');
        ctx = this.canvas.getContext('2d');

        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        ctx['height'] = canvas.height;
        ctx['width'] = canvas.width;
        ctx.scale(canvas.width / WIDTH, canvas.height / HEIGHT);

        window.requestAnimationFrame(redraw);
        Controller.init();
    },
    init: function () {
        translation = 0;
        score = 0;
        gameState = STATE.standing;
        this.redraw();
    },
    restart: function () {
        gameObjects.target = new Target(gameObjects.target.image);
        gameObjects.character = new Character(gameObjects.character.image);
        Controller.init();
    }
};

var View = {
    redraw: function () {
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
    },
    drawGameOver: function (ctx) {
        media.playSound('ouch');
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


    },
    drawScore: function (ctx) {
        ctx.fillStyle = '#000000';
        ctx.font = '20px Arial bold';
        ctx.fillText('Score: ' + score, 0, 20);
    }
};



const HITBOX = {
    upperBound: 140,
    lowerBound: 260
};

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
            restart();
    }

}

window.addEventListener('keydown', processInput);
window.addEventListener('touchend', processInput);
window.addEventListener('load', onLoad);
window.addEventListener('deviceready', loadAudioCordova);


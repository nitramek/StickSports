const WIDTH = 800;
const HEIGHT = 480;
const STATE = {
    standing: 0,
    falling: 1,
    flying: 2,
    hitting: 3,
    gameOver: 4
};


const HITBOX = {
    upperBound: 140,
    lowerBound: 260
};

const SCORE_KEY = "score";

const GRAVITY = 0.1;

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

var gameObjects = {
    background: {
        ground: {
            color: "#AAAAAA",
            x: 0,
            y: 350
        },
        draw: function () {
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
var controller;

window.addEventListener('load', main);

function main() {
    Resources.load();
    controller = new Controller();
    controller.init();


    window.addEventListener('keydown', processInput);
    window.addEventListener('touchend', processInput);
    requestAnimationFrame(View.redraw);

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
            controller.restart();
            requestAnimationFrame(View.redraw);
    }

};
//nejak nejde
//window.addEventListener('deviceready', loadAudioCordova);



function sortCmp(a, b) {
    return b - a;
}







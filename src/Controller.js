function Controller() {
    var canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    ctx['height'] = canvas.height;
    ctx['width'] = canvas.width;
    ctx.scale(canvas.width / WIDTH, canvas.height / HEIGHT);
    this.init = function () {
        translation = 0;
        score = 0;
        gameState = STATE.standing;
    };
    this.restart = function () {
        gameObjects.target = new Model.Target(gameObjects.target.image);
        gameObjects.character = new Model.Character(gameObjects.character.image);
        this.init();
    };
}
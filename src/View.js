var View = {
    redraw: function () {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        for (var objName in gameObjects) {
            //noinspection JSUnfilteredForInLoop
            var gameObject = gameObjects[objName];
            gameObject.draw(ctx);
        }
        View.drawScore(ctx);
        if (gameState == STATE.gameOver) {
            View.drawGameOver(ctx);
        }
        if (gameState != STATE.gameOver) {
            window.requestAnimationFrame(View.redraw);
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
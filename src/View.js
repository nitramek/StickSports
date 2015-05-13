var View = {
    redraw: function () {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        for (var objName in gameObjects) {
            //noinspection JSUnfilteredForInLoop
            var gameObject = gameObjects[objName];
            if (Array.isArray(gameObject)) {
                for(var i in gameObject){
                    if (Model.isVisible(gameObject[i])) {
                        gameObject[i].draw();
                        gameObject[i].collision();

                    }else{
                        gameObject.splice(i,1);
                    }
                }
            } else {
                gameObject.draw();
            }

        }
        View.drawScore();
        if (gameState == STATE.gameOver) {
            View.drawGameOver(ctx);
        }
        if (gameState != STATE.gameOver) {
            window.requestAnimationFrame(View.redraw);
        }
        if (score > 0 && score % 60 == 0) {
            controller.addMine();
        }
    },
    drawGameOver: function () {
        media.playSound('ouch');
        var scores = Resources.getHighScores();
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
    drawScore: function () {
        ctx.fillStyle = '#000000';
        ctx.font = '20px Arial bold';
        ctx.fillText('Score: ' + score, 0, 20);
    }
};
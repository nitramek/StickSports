var Resources = {
    load: function () {
        gameState = STATE.standing;
        var targetImg = new Image();
        targetImg.src = 'assets/targetGuy.png';
        targetImg.addEventListener('load', function () {
            gameObjects['target'] = new Model.Target(this);
        });
        var charImg = new Image();
        charImg.src = 'assets/spriteGuyAll.png';
        charImg.addEventListener('load', function () {
            gameObjects['character'] = new Model.Character(this);
        });
        Resources.loadAudioDesktop();
        Resources.loadAudioCordova();
    },
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
                    oneMedia['value'] = new Media(oneMedia.src, Resources.afterPlay);
                }
            }
        }
    },
    afterPlay: function () {
        this.stop();
        this.release();
    }

};
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

{
    let view = {
        el: '#page',
        template: `
        <div class="blur-bg"></div>
        <a href="./index.html"><img class='play-logo' src="./dist/img/music163.png"></a>
        <div class="disc">
            <div class='cover-wrap'>
                <img class="ring" src="//s3.music.126.net/m/s/img/disc-ip6.png?69796123ad7cfe95781ea38aac8f2d48" alt="">
                <img class="light" src="//s3.music.126.net/m/s/img/disc_light-ip6.png?996fc8a2bc62e1ab3f51f135fc459577" alt="">
                <div class="cover-crop">
                    <div class="cover"></div>

                </div>
            </div>
                <div class="play-button-wrap">
                    <img class='play-button' src="./dist/img/playButton.png">
                </div>
        </div>

        <div class="song-info">
            <h1 class="song-name">{{songName}}</h1>
            <div class="song-lyrics"></div>
        </div>


        <div class="app-intro">
            <a type="button" class="app-open">Open</a>
            <a type="button" class="app-download">Download</a>
        </div>
        <audio src="{{songUrl}}"></audio>
        `,
        render(data) {
            window.testData = data;
            let { status, song } = data;
            $(this.el).html(this.template);
            let content = this.template.replace("{{songUrl}}", song.link).replace("{{songName}}", song.name);

            // use reg to split the time
            let reg = /\[([\d:.]+)\](.+)/;
            let lyricsTimeLine;
            let array = song.lyrics.split('\n').map(i => {
                let result = i.match(reg);
                if (result) {
                    lyricsTimeLine = true;
                    let minutes = result[1].split(':')[0];
                    let seconds = result[1].split(':')[1];
                    let newTime = parseInt(minutes) * 60 + parseFloat(seconds);
                    return $('<p></p>').text(result[2]).attr('data-time', newTime);
                } else {
                    return $('<p></p>').text(i);
                }
            });
            $(this.el).html(content);
            if (song.cover) {
                this.useCover(song.cover);
            } else {
                this.useCover(song.defaultCover);
            }
            $(this.el).find('.song-lyrics').append(array);

            let audio = $(this.el).find('audio').get(0);
            audio.onended = () => {
                eventHub.emit('songEnd', {});
            };
            if (lyricsTimeLine) {
                audio.ontimeupdate = () => {
                    this.checkLyrics(audio.currentTime);
                };
            } else {
                $(this.el).find('.song-lyrics').css('overflow', 'scroll');
            }
        },

        play() {
            $(this.el).find('audio')[0].play();
            $(this.el).find('.disc').addClass('active');
        },

        pause() {
            $(this.el).find('audio')[0].pause();
            $(this.el).find('.disc').removeClass('active');
        },

        useCover(url) {
            $(this.el).find('.cover').css('background-image', `url(${url})`);
            $(this.el).find('.blur-bg').css('background-image', `url(${url})`);
        },

        checkStatus(status) {
            status ? this.play() : this.pause();
        },

        checkLyrics(time) {
            let lyricTimes = $(this.el).find('.song-lyrics > p');
            let p;
            for (let i = 0; i < lyricTimes.length; i++) {
                if (i === lyricTimes.length - 1) {
                    p = lyricTimes[i];
                    break;
                } else {
                    let currentTime = lyricTimes[i].getAttribute('data-time');
                    let nextTime = lyricTimes[i + 1].getAttribute('data-time');
                    if (currentTime <= time && time < nextTime) {
                        p = lyricTimes[i];
                        break;
                    }
                }
            }
            let pHeight = p.getBoundingClientRect().top;
            let lyricAllHeight = $(this.el).find('.song-lyrics > p')[0].getBoundingClientRect().top;
            let scroll = lyricAllHeight - pHeight;

            $(this.el).find('.song-lyrics > p').css({ transform: `translateY(${scroll + 25}px)` });
            $(p).addClass('active').siblings().removeClass('active');
        }
    };

    let model = {
        data: {
            song: {
                id: '',
                name: '',
                singer: '',
                link: '',
                cover: '',
                defaultCover: 'http://res.cloudinary.com/shuaiyuan/image/upload/q_53/v1532056943/1_vyrvol.jpg'
            },
            status: false
        },
        getSongData(id) {
            var query = new AV.Query('Song');
            return query.get(id).then(data => {
                let { id, attributes } = data;
                Object.assign(this.data.song, _extends({ id }, attributes));
            });
        }

    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            let id = this.getSongId();
            this.model.getSongData(id).then(() => {
                this.view.render(this.model.data);
            }).then(() => {
                this.bindEvents();
            });
        },

        bindEvents() {
            this.playSong();
            this.pauseSong();
            eventHub.on('songEnd', () => {
                this.model.data.status = false;
                this.view.checkStatus(this.model.data.status);
            });
        },

        playSong() {

            $(this.view.el).on('click', '.play-button', e => {
                this.model.data.status = true;
                this.view.checkStatus(this.model.data.status);
                e.stopPropagation();
            });
        },
        pauseSong() {
            $(this.view.el).on('click', '.play-button-wrap', () => {
                this.model.data.status = false;
                this.view.checkStatus(this.model.data.status);
            });
        },
        getSongId() {
            let query = window.location.search;
            if (query.indexOf('?') === 0) {
                query = query.substring(1);
            }
            let queryArray = query.split('&').filter(v => v);
            let id = '';
            queryArray.map(i => {
                let kv = i.split('=');
                let key = kv[0];
                let value = kv[1];
                if (key === 'id') {
                    id = value;
                    return;
                };
            });

            return id;
        },

        watchSongPlay() {
            let audio = $(this.el).find('audio');
        }
    };

    controller.init(view, model);
}
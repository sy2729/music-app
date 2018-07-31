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
            <a type="button" class="prev">Prev</a>
            <a type="button" class="next">Next</a>
        </div>
        <audio src="{{songUrl}}"></audio>
        `,
        render(data) {
            window.testData = data;
            let {status, song} = data;
            $(this.el).html(this.template);
            let content = this.template
                .replace("{{songUrl}}", song.link || '')
                .replace("{{songName}}", song.name);

            // use reg to split the time
            let reg = /\[([\d:.]+)\](.+)/;
            let lyricsTimeLine;
            let array = song.lyrics.split('\n')
                        .map((i)=>{
                            let result = i.match(reg);
                            if(result) {
                                lyricsTimeLine = true;
                                let minutes = result[1].split(':')[0];
                                let seconds = result[1].split(':')[1];
                                let newTime = parseInt(minutes) * 60 + parseFloat(seconds);
                                return $('<p></p>').text(result[2]).attr('data-time', newTime);
                            }else {
                                return $('<p></p>').text(i);
                            }
                        })
            $(this.el).html(content);
            if(song.cover) {
                this.useCover(song.cover)
            }else {
                this.useCover(song.defaultCover)
            }
            $(this.el).find('.song-lyrics').append(array);

            let audio = $(this.el).find('audio').get(0);
            audio.onended = ()=>{
                eventHub.emit('songEnd', {});
            }
            if(lyricsTimeLine) {
                audio.ontimeupdate = ()=>{
                    this.checkLyrics(audio.currentTime)
                }
            }else {
                $(this.el).find('.song-lyrics').css('overflow', 'scroll');
            }

            // automaticallt start the music
            if(status) {
                this.play()
            }
            
            
        },

        play() {
            this.playPromise = $(this.el).find('audio')[0].play();
            if (this.playPromise !== undefined) {
                this.playPromise.then(_ => {
                    // Automatic playback started!
                    console.log('Automatic playback started!')
                    $(this.el).find('.disc').addClass('active');
                    // We can now safely pause video...
                })
            }
        },
        
        pause() {
            $(this.el).find('audio')[0].pause();
            $(this.el).find('.disc').removeClass('active');
        },

        useCover(url){
            $(this.el).find('.cover').css('background-image', `url(${url})`);
            $(this.el).find('.blur-bg').css('background-image', `url(${url})`);
        },

         checkStatus(status){
             status ? this.play() : this.pause();
         },

         checkLyrics(time){
             let lyricTimes = $(this.el).find('.song-lyrics > p');
             let p;
             for(let i = 0; i < lyricTimes.length; i++) {
                 if (i === lyricTimes.length - 1) {
                    p = lyricTimes[i]
                    break;
                 }else {
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
                 
                $(this.el).find('.song-lyrics > p').css({transform: `translateY(${scroll + 25}px)`});
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
                defaultCover: 'http://res.cloudinary.com/shuaiyuan/image/upload/q_53/v1532056943/1_vyrvol.jpg',
            },
            status: true
        },
        getSongData(id){
            var query = new AV.Query('Song');
            return query.get(id).then((data)=>{
                let {id, attributes} = data;
                Object.assign(this.data.song, {id, ...attributes})
            })
        },
        // get all song data from this collection
         getCollectionInfo(id) {
             this.data.cid = id;
             let songCollection = AV.Object.createWithoutData('SongCollection', id);
             var query = new AV.Query('SongMapSongCollection');

             // 查询所有选择了线性代数的学生
             query.equalTo('collection', songCollection);

             let songs = [];
             // 执行查询
             return query.find().then((songMapSongCollection) => {
                 // studentCourseMaps 是所有 course 等于线性代数的选课对象
                 // 然后遍历过程中可以访问每一个选课对象的 student,course,duration,platform 等属性
                 songMapSongCollection.forEach((scm, i, a) => {
                     let song = scm.get('song');
                     let songName = scm.get('songName');
                     songs.push({ name: songName, id: song.id });
                 });
                 this.data.songs = songs;
             }, (e) => {
                 console.log(e)
             });     
         },

        //  switchSong(newSong) {
        //      let id = newSong.id;
        //      console.log(id);
        //  }
     };

     let controller = {
         init(view, model) {
            this.view = view;
            this.model = model;
            let id = this.getSongId();
            this.model.getSongData(id)
                .then(()=>{
                    this.view.render(this.model.data);
                }).then(()=>{
                    this.bindEvents();
                })
         },

         bindEvents(){
             this.playSong();
             this.pauseSong();
             eventHub.on('songEnd', () => {
                this.model.data.status = false;
                this.view.checkStatus(this.model.data.status);
                let nextSong = this.nextSong(this.model.data.song.id);
                this.model.getSongData(nextSong.id)
                    .then(() => {
                        this.view.render(this.model.data);
                    })
            });

            // play the next song
            
            $(this.view.el).on('click','.prev', ()=>{
                let prevSong = this.prevSong(this.model.data.song.id);
                this.model.getSongData(prevSong.id)
                    .then(()=>{
                        this.view.render(this.model.data);
                    })

            })
            
            $(this.view.el).on('click','.next', ()=>{
                let nextSong = this.nextSong(this.model.data.song.id);
                this.model.getSongData(nextSong.id)
                    .then(()=>{
                        this.view.render(this.model.data);
                    })
            })

         },

         nextSong(id) {
             let allSongs = this.model.data.songs;
             let nextSong;
             for (let i = 0; i < allSongs.length; i++) {
                 if (allSongs[i].id === id) {
                     if (i === allSongs.length - 1) {
                         nextSong = allSongs[0];
                     } else {
                         nextSong = allSongs[i + 1];
                     }
                     break
                 }
             }
             return nextSong;
         },

         prevSong(id){
            let allSongs = this.model.data.songs;
            let prevSong;
            for(let i = 0; i < allSongs.length; i++) {
                if(allSongs[i].id === id) {
                    if(i === 0) {
                        prevSong = allSongs[allSongs.length - 1];
                    }else {
                        prevSong = allSongs[i-1]
                    }
                    break
                }
            }
            return prevSong;
         },

         playSong(){
             
             $(this.view.el).on('click', '.play-button', (e)=>{
                this.model.data.status = true;
                this.view.checkStatus(this.model.data.status);
                e.stopPropagation();
            })

         },
         pauseSong(){
             $(this.view.el).on('click','.play-button-wrap',() => {
                 this.model.data.status = false;
                 this.view.checkStatus(this.model.data.status);
             })
         },
         getSongId() {
             let query = window.location.search;
             if (query.indexOf('?') === 0) {
                 query = query.substring(1)
             }
             let queryArray = query.split('&').filter(v => v);
             [id, cid] = '';
             queryArray.map((i) => {
                 let kv = i.split('=');
                 let key = kv[0];
                 let value = kv[1];
                 if (key === 'id') {
                     id = value;   
                 };
                 if(key === 'cid') {
                     cid = value;
                 }
             })

             if(cid) {
                 this.getCollectionInfo(cid);
             }
             return id;
         },

         getCollectionInfo(cid) {
            this.model.getCollectionInfo(cid)
                .then(()=>{
                    console.log(this.model.data)
                    // this.model.getAllSongInCollection()
                })
         },

         watchSongPlay(){
            let audio = $(this.el).find('audio');

         }
     }

     controller.init(view, model);
 }
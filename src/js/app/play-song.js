 {
     let view = {
        el: '#page',
        template: `
        <div class="blur-bg"></div>
        <a href="./index.html"><img class='play-logo' src="./dist/img/music163.png"></a>
        <div class="disc">
            <img class="ring" src="//s3.music.126.net/m/s/img/disc-ip6.png?69796123ad7cfe95781ea38aac8f2d48" alt="">
            <img class="light" src="//s3.music.126.net/m/s/img/disc_light-ip6.png?996fc8a2bc62e1ab3f51f135fc459577" alt="">
            <div class="cover-crop">
                <img class="cover" src="{{cover}}"
                alt="">

                <div class="play-button-wrap">
                    <img class='play-button' src="./dist/img/playButton.png">
                </div>
            </div>
        </div>

        <div class="song-info">
            <h1 class="song-name">Song - Name</h1>
        </div>

        <div class="app-intro">
            <a type="button" class="app-open">Open</a>
            <a type="button" class="app-download">Download</a>
        </div>
        <audio src="{{songUrl}}"></audio>
        `,
        render(data) {
            $(this.el).html(this.template);
            let content = this.template.replace("{{songUrl}}", data.link);
            if (data.cover === '') {
                content = content.replace("{{cover}}", data.defaultCover);
            }else {
                content = content.replace("{{cover}}", data.cover);
            }
            $(this.el).html(content);
        },

        play() {
            $(this.el).find('audio')[0].play();
            $(this.el).find('.disc').addClass('active');
        },
        
        pause() {
            $(this.el).find('audio')[0].pause();
            $(this.el).find('.disc').removeClass('active');
        },

        useCover(url){
            $(this.el).find('.blur-bg').css('background-image', `url(${url})`);
        },

        useDefaultCover(url){
            $(this.el).find('.blur-bg').css('background-image', `url(${url})`);
        }
     };

     let model = {
        data: {
            id: '',
            name: '',
            singer: '',
            link: '',
            cover: '',
            defaultCover: 'http://res.cloudinary.com/shuaiyuan/image/upload/q_53/v1532056943/1_vyrvol.jpg',
        },
        getSongData(id){
            var query = new AV.Query('Song');
            return query.get(id).then((data)=>{
                let {id, attributes} = data;
                Object.assign(this.data, {id, ...attributes})
            })
        }

        
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
                    if (this.model.data.cover === '') {
                        this.view.useDefaultCover(this.model.data.defaultCover);
                    }else {
                        this.view.useDefaultCover(this.model.data.cover);
                    }
                    this.bindEvents();
                })
            
         },

         bindEvents(){
            this.playSong();
            this.pauseSong();
            this.changeCover();
         },

         playSong(){
             
             $(this.view.el).on('click', '.play-button', (e)=>{
                this.view.play();
                e.stopPropagation();
            })

         },
         pauseSong(){
             $(this.view.el).on('click','.play-button-wrap',() => {
                 this.view.pause();
             })
         },
         getSongId() {
             let query = window.location.search;
             if (query.indexOf('?') === 0) {
                 query = query.substring(1)
             }
             let queryArray = query.split('&').filter(v => v);
             let id = '';
             queryArray.map((i) => {
                 let kv = i.split('=');
                 let key = kv[0];
                 let value = kv[1];
                 if (key === 'id') {
                     id = value;
                     return
                 };

             })

             return id;
         },

         changeCover(){

         }
     }

     controller.init(view, model);
 }
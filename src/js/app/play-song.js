 {
     let view = {
        el: '#page',
        template: `
        <div class="blur-bg"></div>
        <div class="disc">
            <img class="ring" src="//s3.music.126.net/m/s/img/disc-ip6.png?69796123ad7cfe95781ea38aac8f2d48" alt="">
            <img class="light" src="//s3.music.126.net/m/s/img/disc_light-ip6.png?996fc8a2bc62e1ab3f51f135fc459577" alt="">
            <div class="cover-crop">
                <img class="cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJcxA7zgZV18VbaOmtChAVxMBSdU0qHYZ_6pp19P89431Vf-oZ"
                alt="">

                <img class='play-button' src="./dist/img/playButton.png">
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
            <button class="play">play</button>
            <button class="pause">pause</button>
        `,
        render(data) {
            let content = this.template.replace("{{songUrl}}", data.link);
            $(this.el).html(content);
        },

        play() {
            $(this.el).find('audio')[0].play();
            $(this.el).find('.disc').addClass('active');
        },
        
        pause() {
            $(this.el).find('audio')[0].pause();
            $(this.el).find('.disc').removeClass('active');
        }
     };

     let model = {
        data: {
            id: '',
            name: '',
            singer: '',
            link: ''
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
                    this.bindEvents();
                })
            
         },

         bindEvents(){
            this.playSong();
            this.pauseSong();
         },

         playSong(){
             
             $(this.view.el).on('click', '.play-button', ()=>{
                this.view.play();
            })

         },
         pauseSong(){
             $(this.view.el).on('click','.cover',() => {
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
         }
     }

     controller.init(view, model);
 }
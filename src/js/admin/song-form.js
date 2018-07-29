{
    let view = {
        el: '.song-form',
        init(){
            this.$el = $(this.el);
        },
        template: `
            <form>
            <div>
            <label for="">Song Name</label>
            <input type="text" value='__name__' name='name'>
            <span class="input-alert">The name can't be empty</span>
            </div>
            <div><label for="">Singer</label>
            <input type="text" name='singer' value='__singer__'></div>
            <div><label for="">Link</label>
            <input type="text" value='__link__' name='link'></div>
            <div><label for="">Cover</label>
            <input type="text" value='__cover__' name='cover'></div>
            <div><label for="">Lyrics</label>
            <textarea type="text" name='lyrics'>{{lyrics}}</textarea></div>

            <button type='submit'>Submit</button>
            <button class='delete'>Delete</button>
            </form>
        `,

        render(data = {}){
            let placeholder = ['name','link', 'singer', 'cover'];
            let html = this.template;
            placeholder.map((word)=> {
                html = html.replace(`__${word}__`, data[word] || '');
            })
            
            html = html.replace('{{lyrics}}', data.lyrics || '');
            $(this.el).html(html);

            if(data.id){
                $(this.el).prepend('<h2>Edit Song</h2>')
            }else {
                $(this.el).prepend('<h2>New Song</h2>')
            }
        },

        reset() {
            this.render({})
        },

        inputAlert(state){
            if(state) {
                $(this.el).find('.input-alert').addClass('active');
            }else {
                $(this.el).find('.input-alert').removeClass('active');
            }
        }

    };

    let model = {
        data: {
            name: '', singer: '', link: '', id: '', cover: '', lyrics: '',
        },
        create(data){
            var Song = AV.Object.extend('Song');
            var song = new Song();
            return song.save({
                name: data.name, singer: data.singer, link: data.link, cover: data.cover, lyrics: data.lyrics,
            }).then((newSong)=>{
                let {id, attributes} = newSong; 
                 Object.assign(this.data, {id, ...attributes});
            })
        },

        update(data){
            var song = AV.Object.createWithoutData('Song', this.data.id);
            song.set('name', data.name)
            song.set('singer', data.singer)
            song.set('link', data.link)
            song.set('cover', data.cover)
            song.set('lyrics', data.lyrics)
            return song.save().then((response)=>{
                Object.assign(this.data, data);
                return response;
            });
        },

        delete(data) {
            var song = AV.Object.createWithoutData('Song', data.id);
            return song.destroy().then((success)=> {
                
            }, function (error) {
                console.log('删除失败')
            });
        }
    };

    let controller = {
        init(view, model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);           
            this.view.init();
            this.bindEvents();
            this.bindEventHub();
        },

        bindEvents(){
            this.view.$el.on('submit', 'form', (e)=>{
                e.preventDefault();
                eventHub.emit('songAdding')
                if(this.model.data.id) {
                    this.update();
                }else {
                    this.create();

                }
                
            });

            this.checkNameInput();
            this.view.$el.on('click', '.delete', ()=>{
                eventHub.emit('songDeleting');
                this.model.delete(this.model.data)
                .then(()=>{
                    eventHub.emit('songDeleted', this.model.data.id);
                    this.model.data = {};
                        this.view.render(this.model.data);
                    })
            })
        },

        create(){
            let userInputs = 'name singer link cover lyrics'.split(' ');
            let data = {};
            userInputs.map((item) => {
                data[item] = this.view.$el.find(`[name="${item}"]`).val();
                
            })
            let checkResult = this.checkSubmit(data);
            if (checkResult) {
                this.model.create(data)
                    .then(() => {
                        eventHub.emit('created');
                        var string = JSON.stringify(this.model.data);
                        var newData = JSON.parse(string);
                        this.view.reset();
                        eventHub.emit('create', newData);

                    })
                }
        },

        update(){
            let userInputs = 'name singer link cover lyrics'.split(' ');
            let data = {};
            userInputs.map((item) => {
                data[item] = this.view.$el.find(`[name="${item}"]`).val();
            });

            let checkResult = this.checkSubmit(data);
            if(checkResult) {
                this.model.update(data)
                    .then(()=>{
                        eventHub.emit('updated');
                        eventHub.emit('update', this.model.data);
                });
            }
        },

        bindEventHub(){
            eventHub.on('select', (data)=>{
                this.model.data = data;
                this.view.render(this.model.data);
            });

            eventHub.on('upload', (data) => {
                this.model.data = data;
                this.view.render(this.model.data);
            });

            eventHub.on('addNewSong', (data)=>{
                if(this.model.data.id) {
                    this.model.data = {};
                    this.view.render(this.model.data);
                }
            });

            eventHub.on('switchPage', (data) => {
                if (data !== 'songList') {
                    $(this.view.el).addClass('active');
                    $('.song-list-aside').addClass('active');

                } else {
                    $(this.view.el).removeClass('active')
                    $('.song-list-aside').removeClass('active');
                }
            });
        },

        checkSubmit(data){
            if (data['name'] === ''){
                this.view.inputAlert(true);
                return false;
            }else {
                return true;
            }
        },

        checkNameInput(){
            $(this.view.el).on('keydown', "[name='name']", ()=>{
                this.view.inputAlert(false);
            })
        }
    };

    controller.init(view, model);
}
{
    let view = {
        el: '.song-form',
        init(){
            this.$el = $(this.el);
        },
        template: `
            <form>
            <div><label for="">Song Name</label>
            <input type="text" value='__songName__' name='name'></div>
            <div><label for="">Singer</label>
            <input type="text" name='singer'></div>
            <div><label for="">Link</label>
            <input type="text" value='__songLink__' name='link'></div>

            <button type='submit'>Submit</button>
            </form>
        `,

        render(data = {}){
            let placeholder = ['songName','songLink'];
            let html = this.template;
            placeholder.map((word)=> {
                html = html.replace(`__${word}__`, data[word] || '');
            })
            $(this.el).html(html);
        },

        reset() {
            this.render({})
        }

    };

    let model = {
        data: {
            name: '', singer: '', link: '', id: '',
        },
        create(data){
            var Song = AV.Object.extend('Song');
            var song = new Song();
            return song.save({
                name: data.name, singer: data.singer, link: data.link
            }).then((newSong)=>{
                let {id, attributes} = newSong;
                 Object.assign(this.data, {id, ...attributes});
            })
        }
    };

    let controller = {
        init(view, model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            eventHub.on('upload', (data)=>{
                this.view.render(data);
            });
            this.view.init();
            this.bindEvents();
        },

        bindEvents(){
            this.view.$el.on('submit', 'form', (e)=>{
                e.preventDefault();
                let userInputs = 'name singer link'.split(' ');
                let data = {};
                userInputs.map((item)=>{
                   data[item] = this.view.$el.find(`[name="${item}"]`).val();
                })  
                this.model.create(data)
                    .then(()=>{
                        var string = JSON.stringify(this.model.data);
                        var newData = JSON.parse(string);
                        this.view.reset();
                        eventHub.emit('create', newData);
                        
                    })
                
            })
        },
    };

    controller.init(view, model);
}
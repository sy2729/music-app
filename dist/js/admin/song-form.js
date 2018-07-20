var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

{
    let view = {
        el: '.song-form',
        init() {
            this.$el = $(this.el);
        },
        template: `
            <form>
            <div><label for="">Song Name</label>
            <input type="text" value='__name__' name='name'></div>
            <div><label for="">Singer</label>
            <input type="text" name='singer'></div>
            <div><label for="">Link</label>
            <input type="text" value='__link__' name='link'></div>
            <div><label for="">Cover</label>
            <input type="text" value='__cover__' name='cover'></div>

            <button type='submit'>Submit</button>
            </form>
        `,

        render(data = {}) {
            let placeholder = ['name', 'link', 'cover'];
            let html = this.template;
            placeholder.map(word => {
                html = html.replace(`__${word}__`, data[word] || '');
            });
            $(this.el).html(html);

            if (data.id) {
                $(this.el).prepend('<h2>Edit Song</h2>');
            } else {
                $(this.el).prepend('<h2>New Song</h2>');
            }
        },

        reset() {
            this.render({});
        }

    };

    let model = {
        data: {
            name: '', singer: '', link: '', id: '', cover: ''
        },
        create(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            return song.save({
                name: data.name, singer: data.singer, link: data.link, cover: data.cover
            }).then(newSong => {
                let { id, attributes } = newSong;
                Object.assign(this.data, _extends({ id }, attributes));
            });
        },

        update(data) {
            var song = AV.Object.createWithoutData('Song', this.data.id);
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('link', data.link);
            song.set('cover', data.cover);
            return song.save().then(response => {
                Object.assign(this.data, data);
                return response;
            });
        }
    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            this.view.init();
            this.bindEvents();
            this.bindEventHub();
        },

        bindEvents() {
            this.view.$el.on('submit', 'form', e => {
                e.preventDefault();

                if (this.model.data.id) {
                    this.update();
                } else {
                    this.create();
                }
            });
        },

        create() {
            let userInputs = 'name singer link cover'.split(' ');
            let data = {};
            userInputs.map(item => {
                data[item] = this.view.$el.find(`[name="${item}"]`).val();
            });

            this.model.create(data).then(() => {
                var string = JSON.stringify(this.model.data);
                var newData = JSON.parse(string);
                this.view.reset();
                eventHub.emit('create', newData);
            });
        },

        update() {
            let userInputs = 'name singer link cover'.split(' ');
            let data = {};
            userInputs.map(item => {
                data[item] = this.view.$el.find(`[name="${item}"]`).val();
            });
            this.model.update(data).then(() => {
                eventHub.emit('update', this.model.data);
            });
        },

        bindEventHub() {
            eventHub.on('select', data => {
                this.model.data = data;
                this.view.render(this.model.data);
            });

            eventHub.on('upload', data => {
                this.model.data = data;
                this.view.render(this.model.data);
            });

            eventHub.on('addNewSong', data => {
                if (this.model.data.id) {
                    this.model.data = {};
                    this.view.render(this.model.data);
                }
            });
        }
    };

    controller.init(view, model);
}
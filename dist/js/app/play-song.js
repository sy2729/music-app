var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

{
    let view = {
        el: '#song',
        template: `
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
        },

        pause() {
            $(this.el).find('audio')[0].pause();
        }
    };

    let model = {
        data: {
            id: '',
            name: '',
            singer: '',
            link: ''
        },
        getSongData(id) {
            var query = new AV.Query('Song');
            return query.get(id).then(data => {
                let { id, attributes } = data;
                Object.assign(this.data, _extends({ id }, attributes));
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
            });
            this.bindEvents();
        },

        bindEvents() {
            this.playSong();
            this.pauseSong();
        },

        playSong() {
            //  console.log($(this.view.el))
            $(this.view.el).on('click', '.play', () => {
                this.view.play();
            });
        },
        pauseSong() {
            $(this.view.el).on('click', '.pause', () => {
                this.view.pause();
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
        }
    };

    controller.init(view, model);
}
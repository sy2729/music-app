var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

{
    let view = {
        el: '.list-wrap',
        template: `
            <ul>
            </ul>
        `,
        render(data) {
            //initilization
            $(this.el).html(this.template);

            //replaced with data;
            let { songs } = data;
            let liList = songs.map(each => {
                var $li = $('<li></li>').text(each.name).attr('data-id', each.id);
                if (each.id === data.selectedSongId) {
                    $li.addClass('active');
                }
                return $li;
            });
            $(this.el).find('ul').empty();
            liList.map(i => {
                $(this.el).find('ul').append(i);
            });
        },
        deactivateItem() {
            var lis = $(this.el).children().children();
            lis.each((i, item) => {
                $(item).removeClass('active');
            });
        }
    };

    let model = {
        data: {
            songs: [],
            selectedSongId: undefined
        },

        find() {
            let dataQuery = new AV.Query('Song');
            return dataQuery.find().then(data => {
                this.data.songs = data.map(i => {
                    return _extends({ id: i.id }, i.attributes);
                });
                return data;
            });
        }

    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            this.getAllData();
            this.bindEventHub();
            this.bindEvents();
        },

        getAllData() {
            return this.model.find().then(() => {
                this.view.render(this.model.data);
            });
        },

        bindEvents() {
            $(this.view.el).on('click', 'li', e => {
                let songs = this.model.data.songs;
                let id = $(e.currentTarget).attr('data-id');
                this.model.data.selectedSongId = id;
                this.view.render(this.model.data);
                let data;
                for (let i = 0; i < songs.length; i++) {
                    if (songs[i].id === id) {
                        data = songs[i];
                        break;
                    }
                }
                eventHub.emit('select', JSON.parse(JSON.stringify(data)));
            });
        },
        bindEventHub() {
            window.eventHub.on('create', songData => {
                this.model.data.songs.push(songData);
                this.view.render(this.model.data);
            });

            eventHub.on('addNewSong', () => {
                this.view.deactivateItem();
            });

            eventHub.on('upload', () => {
                this.view.deactivateItem();
            });

            eventHub.on('update', data => {
                var songs = this.model.data.songs;
                for (let i = 0; i < songs.length; i++) {
                    if (songs[i].id === data.id) {
                        this.model.data.songs[i] = data;
                        break;
                    };
                };
                this.view.render(this.model.data);
            });
        }
    };

    controller.init(view, model);
}
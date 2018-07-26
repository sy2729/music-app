var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

{
    let view = {
        el: '#songSelection',
        template: `
            <div class="list-wrap">
                <ul class='song-list-total'>

                </ul>
                <ul class='song-list-selected'>
                    <li>song1</li>
                    <li>song8</li>
                </ul>
            </div>

            <div class='info-wrap clearfix'>
                <button class='cancel'>Cancel</button>
                <button class='confirm'>OK</button>
            </div>
        
        `,
        render(data = {}) {
            $(this.el).html(this.template);

            if (data.allSongs) {
                let lis = this.createSongLis(data.allSongs);
                $(this.el).find('.song-list-total').empty().append(lis);
            }
        },

        createSongLis(data) {
            let lis = data.map(i => {
                return $('<li></li>').text(i.name).attr('data-id', i.id);
            });

            return lis;
        }

    };

    let model = {
        data: {
            allSongs: []
        },

        getAllSong() {
            let dataQuery = new AV.Query('Song');
            return dataQuery.find().then(data => {
                this.data.allSongs = data.map(i => {
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
            this.getAllSong();

            this.view.render({});
            this.bindEvent();
            this.bindEventHub();
        },

        getAllSong() {
            this.model.getAllSong().then(data => {
                this.view.render(this.model.data);
            });
        },

        bindEvent() {},

        bindEventHub() {
            eventHub.on('addSongToCollecton', () => {
                $(this.view.el).addClass('active');
            });
            eventHub.on('closeAddSongToCollection', () => {

                $(this.view.el).removeClass('active');
            });
        }
    };

    controller.init(view, model);
}
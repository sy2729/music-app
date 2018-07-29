var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

{
    let view = {
        el: '#songCollection',
        template: `
            <ul class='song-collection-list'>
            </ul>

            <section class='otherArea'>
                <div id='newCollection' class='active animate'></div>
                <div id='createNewCollection' class='animate'></div>

                <div class='page-shade animate-3' id='pageShade'></div>
                <div class='songSelection animate-2' id='songSelection'></div>

                <div id='songCollectionEach' class='animate clearfix'></div>
                <div id='songsInCollection'></div>
            </section>
        
         `,
        render(data) {
            if (data) {
                let collections = data.songCollections;
                let lis = collections.map((i, index) => {
                    let li = $('<li></li>').text(i.name).attr('data-id', i.id).addClass('animate opacity-none').css('animation-delay', `${0.05 * index}s`);
                    return li;
                });
                $(this.el).find('.song-collection-list').empty().append(lis);
            } else {
                $(this.el).html(this.template);
            }
        }
    };

    let model = {
        data: {
            songCollections: [],
            currentSelected: '',
            rightPanelBlank: true
        },

        find() {
            let dataQuery = new AV.Query('SongCollection');
            return dataQuery.find().then(data => {
                this.data.songCollections = data.map(i => {
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
            this.view.render();
            this.bindEvent();
            this.getAllData();
            this.createComponent('./dist/js/admin/newCollection.js');
            this.createComponent('./dist/js/admin/createNewCollection.js');
            this.createComponent('./dist/js/admin/songCollectionEach.js');
            this.createComponent('./dist/js/admin/pageShade.js');
            this.createComponent('./dist/js/admin/songSelection.js');
        },

        getAllData() {
            this.model.find().then(() => {
                eventHub.emit('fullyLoaded');
                this.view.render(this.model.data);
            }).then(() => {
                this.bindEventHub();
            });
        },

        bindEvent() {
            $(this.view.el).on('click', '.song-collection-list > li', e => {
                $(e.currentTarget).addClass('active').siblings().removeClass('active');
                let id = $(e.currentTarget).attr('data-id');
                let song = this.querySong(id);
                this.model.data.rightPanelBlank = false;
                if (this.model.data.currentSelected !== id || this.model.data.rightPanelBlank) {
                    this.model.data.currentSelected = id;
                    eventHub.emit('selectCollection', song);
                }
            });
        },

        querySong(id) {
            let collections = this.model.data.songCollections;
            let song;
            collections.map(i => {
                if (i.id === id) {
                    song = i;
                    return;
                }
            });
            return song;
        },

        bindEventHub() {
            switchPage.call(this, 'songCollection');
            eventHub.on('returnToHome', () => {
                this.model.data.rightPanelBlank = true;
                this.model.data.currentSelected = '';
                $(this.view.el).find('.song-collection-list > li').removeClass('active');
            });

            eventHub.on('createSongCollectionFinished', data => {
                this.model.data.songCollections.push(data);
                this.view.render(this.model.data);
            });
        },

        createComponent(path) {
            let script = document.createElement('script');
            script.src = path;
            $(document.body).append(script);
        }

    };

    controller.init(view, model);
}
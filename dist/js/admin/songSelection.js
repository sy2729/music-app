var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

{
    let view = {
        el: '#songSelection',
        template: `
            <div class="list-wrap">
                <ul class='song-list-total'></ul>
                <ul class='song-list-selected'>
                    <p style='color: #ddd;'>Select songs from the left panel<p>
                </ul>
            </div>

            <div class='info-wrap clearfix'>
                <button class='cancel'>Cancel</button>
                <button class='confirm' disabled>OK</button>
            </div>
        
        `,
        render(data = {}) {
            if (!data.songSelecting) {

                $(this.el).html(this.template);

                if (data.allSongs) {
                    let lis = this.createSongLis(data.allSongs, false);
                    $(this.el).find('.song-list-total').empty().append(lis);
                } else {
                    // for initial rendering
                    // 
                }
            } else {
                let lis = this.createSongLis(data.songSelected, true);
                $(this.el).find('.song-list-selected').empty().append(lis);
            };
            if (data.songSelected.length === 0) {
                this.disableBUtton();
            } else {
                this.enableButton();
            };

            console.log(data.alreadySelected);
            // if(this.model.data.alreadySelected !== undefined) {
            //     this.model.data.alreadySelected.map((i)=>{
            //         console.log(i);
            //     })
            // }

        },

        createSongLis(data, selectedColumn) {
            let lis = data.map(i => {
                if (selectedColumn) {
                    let span = $('<span></span>').text(i.name);
                    let icon = $('<i></i>').text('x');
                    return $('<li></li>').append(span, icon).attr('data-id', i.id);;
                } else {
                    let span = $('<span></span>').text(i.name).attr('data-id', i.id);
                    return $('<li></li>').append(span);
                }
            });

            return lis;
        },

        deselectStyle(id) {
            $(this.el).find(`[data-id = '${id}']`).removeClass('active').parent().removeClass('active');
        },

        enableButton() {
            $(this.el).find('.confirm').prop('disabled', false);
        },
        disableBUtton() {
            $(this.el).find('.confirm').get(0).disabled = true;
        },
        disableAlreadySelected(ids) {
            ids.map(i => {
                let lis = $(this.el).find('.song-list-total').children();
                for (let j = 0; j < lis.length; j++) {
                    if ($(lis[j]).children().attr('data-id') === i) {
                        $(lis[j]).addClass('active').children().addClass('active');
                    };
                }
            });
        }

    };

    let model = {
        data: {
            allSongs: [],
            songSelected: [],
            songSelecting: false,
            collectionId: ''
        },

        getAllSong() {
            let dataQuery = new AV.Query('Song');
            return dataQuery.find().then(data => {
                this.data.allSongs = data.map(i => {
                    return _extends({ id: i.id }, i.attributes);
                });
                return data;
            });
        },

        cancelAddTheSong(id) {
            let songs = this.data.songSelected;
            for (let i = 0; i < songs.length; i++) {
                if (songs[i].id === id) {
                    songs.splice(i, 1);
                    break;
                }
            };
            this.data.songSelected = songs;
        },

        addSong(obj) {
            this.data.songSelecting = true;
            this.data.songSelected.push(obj);
        },

        saveCollectionSong() {
            // var studentTom = new AV.Object('Student');
            // studentTom.set('name', 'Tom');// 学生 Tom

            // var courseLinearAlgebra = new AV.Object('Course');
            // courseLinearAlgebra.set('name', '线性代数');

            // // 选课表对象
            // var studentCourseMapTom = new AV.Object('StudentCourseMap');

            // // 设置关联
            // studentCourseMapTom.set('student', studentTom);
            // studentCourseMapTom.set('course', courseLinearAlgebra);

            // // 设置学习周期
            // studentCourseMapTom.set('duration', [new Date(2015, 2, 19), new Date(2015, 4, 21)]);

            // // 设置操作平台
            // studentCourseMapTom.set('platform', 'web');

            // // 保存选课表对象
            // studentCourseMapTom.save();

            // let collection = this.data;
            // let obj = {};
            // obj = {...collection};
            // console.log(obj);

            let collection = AV.Object.createWithoutData('SongCollection', this.data.collectionId);
            this.data.songSelected.map(i => {
                let song = AV.Object.createWithoutData('Song', i.id);
                let songMapSongCollection = new AV.Object('SongMapSongCollection');
                songMapSongCollection.save({ song: song, collection, collection });
            });

            // Song.set('name', '东莞');
        }
    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.getAllSong();
            this.bindEvent();
            this.bindEventHub();
        },

        getAllSong() {
            this.model.getAllSong().then(data => {
                this.view.render(this.model.data);
            });
        },

        bindEvent() {
            $(this.view.el).on('click', '.song-list-total > li > span', e => {
                let id = $(e.currentTarget).addClass('active').attr('data-id');
                let name = $(e.currentTarget).text();
                $(e.currentTarget).parent().eq(0).addClass('active');
                this.model.addSong({ id: id, name: name });
                this.view.render(this.model.data);
            });

            $(this.view.el).on('click', '.cancel', e => {
                eventHub.emit('closeAddSongToCollection');
            });
            $(this.view.el).on('click', '.song-list-selected > li', e => {
                let id = $(e.currentTarget).attr('data-id');

                this.model.cancelAddTheSong(id);
                this.view.render(this.model.data);
                this.deselectStyle(id);
            });

            $(this.view.el).on('click', '.confirm', () => {
                this.model.saveCollectionSong();
                eventHub.emit('saveAddSongToCollection', this.model.data.songSelected);
            });
        },

        deselectStyle(id) {
            this.view.deselectStyle(id);
        },

        bindEventHub() {
            eventHub.on('addSongToCollecton', data => {
                this.model.data.collectionId = data.collectionId;
                this.model.data.alreadySelected = data.songsInCollection;
                this.view.render(this.model.data);
                this.view.disableAlreadySelected(this.model.data.alreadySelected);
                $(this.view.el).addClass('active');
            });
            eventHub.on('closeAddSongToCollection', () => {

                $(this.view.el).removeClass('active');
            });
            eventHub.on('saveAddSongToCollection', () => {
                $(this.view.el).removeClass('active');
            });
            eventHub.on('songIdFetchedInCollection', () => {
                eventHub.emit('sendBackAllSongDataToCollection', this.model.data.allSongs);
            });
        }
    };

    controller.init(view, model);
}
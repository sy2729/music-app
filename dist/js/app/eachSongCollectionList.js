{
    let view = {
        el: '#songCollectionList',
        template: `
            <section class="upper">
                <div class="cover">
                    hello
                </div>
            
                <div class='info-wrap'>
                    <p class='title'></p>
                </div>
                <ul class='song-list'>

                </ul>
            </section>
        `,

        init() {
            this.$el = $(this.el);
        },
        render(data) {

            this.$el.html(this.template);

            let songs = data.collections.songs;
            let lis = songs.map(i => {
                let a = $('<a></a>').attr('href', `./song.html?id=${i.id}`).text(i.name);
                let li = $('<li></li>').append(a);
                return li;
            });
            console.log(lis);
            this.$el.find('.song-list').empty().append(lis);
        }
    };

    let model = {
        data: {
            collections: []
        },

        getAllInfo() {},

        queryCollection(id) {
            let songCollection = AV.Object.createWithoutData('SongCollection', id);
            var query = new AV.Query('SongMapSongCollection');

            // 查询所有选择了线性代数的学生
            query.equalTo('collection', songCollection);

            let songs = [];
            // 执行查询
            return query.find().then(songMapSongCollection => {
                // studentCourseMaps 是所有 course 等于线性代数的选课对象
                // 然后遍历过程中可以访问每一个选课对象的 student,course,duration,platform 等属性
                songMapSongCollection.forEach((scm, i, a) => {
                    let song = scm.get('song');
                    let songName = scm.get('songName');
                    songs.push({ name: songName, id: song.id });
                });
                this.data.collections.songs = songs;
            }, e => {
                console.log(e);
            });
        }
    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.init();
            this.getCollectionInfo();
            this.model.getAllInfo();

            this.bindEvent();
            this.bindEventHub();
        },

        bindEvent() {},

        bindEventHub() {},

        getCollectionInfo() {
            let id = this.getCollectionId();
            this.model.queryCollection(id).then(() => {
                this.view.render(this.model.data);
            });
        },

        getCollectionId() {
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
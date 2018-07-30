{
    let view = {
        el: '#sectionSongList',
        template: `
            <h3 class="heading">Song List</h3>
            <ul class='song-list'>
               {{__lis__}}
            </ul>
        `,
        render(data) {
            // song list
            let songs = data.songs;

            let _li_template = `<li>
        <a href="./song.html?id={{__id__}}&cid={{__cid__}}">{{__name__}}</a>
        </li>`;

            let lis = songs.reduce((prev, i) => {
                let template = _li_template;
                prev += template.replace('{{__id__}}', i.id).replace('{{__cid__}}', data.cid).replace('{{__name__}}', i.name);
                return prev;
            }, '');

            let template = this.template.replace('{{__lis__}}', lis);
            $(this.el).html(template);
        }
    };

    let model = {
        data: {},

        getSongData(collectionId) {
            this.data.cid = collectionId;
            let songCollection = AV.Object.createWithoutData('SongCollection', collectionId);
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
                this.data.songs = songs;
            }, e => {
                console.log(e);
            });
        }
    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.bindEventHub();
            this.getSongData();
        },

        bindEventHub() {},

        getSongData() {
            let id = this.getCollectionId();
            this.model.getSongData(id).then(() => {
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
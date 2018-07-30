var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

{
    let view = {
        el: '#songCollectionList',
        template: `
            <section class="upper">
                <div class="cover">
                    <img src='' class="cover-img">
                    <span class="inner-tag"></span>
                    <span class="inner-listened"></span>
                </div>

                 <div class='info-wrap'>
                    <p class='title'></p>
                 </div>
            </section>

            <section class="middle info-wrap">
                
            </section>

            <section id="sectionSongList"></section>
        `,

        init() {
            this.$el = $(this.el);
        },
        render(data = {}) {

            this.$el.html(this.template);

            // this.$el.find('.cover').css('background-image', `url(${data.collections.cover})`).children().eq(0).attr('src', data.collections.cover);


            // let songs = data.collections.songs;
            // let lis = songs.map((i)=>{
            //     let a = $('<a></a>').attr('href', `./song.html?id=${i.id}`).text(i.name)
            //     let li = $('<li></li>').append(a);
            //     return li
            // })
            // this.$el.find('.song-list').empty().append(lis);
        }
    };

    let model = {
        data: {
            collections: []
        },

        queryCollectionInfo(id) {
            let collection = new AV.Query('SongCollection');
            return collection.get(id).then(i => {
                // console.log(i)
                let obj = _extends({ id: i.id }, i.attributes);
                this.data.collections = _extends({}, obj);
            });
        }

    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.init();
            this.view.render({});
            this.getCollectionInfo();
            this.bindEvent();
            this.bindEventHub();
        },

        bindEvent() {},

        bindEventHub() {},

        getCollectionInfo() {
            let id = this.getCollectionId();
            this.model.data.collections.id = id;
            this.model.queryCollectionInfo(id).then(i => {
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
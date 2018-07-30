var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

{
    let view = {
        el: '#songCollectionList',
        template: `
            <section class="upper">
                <div class="cover-bg"></div>
                <div class="cover">
                    <span class="inner-tag">Collection</span>
                    <span class="inner-listened"></span>
                </div>

                 <div class='info-wrap'>
                    <p class='title'>{{__title__}}</p>
                    <div class='creator-info'>
                        <span class="creator-profile"></span>
                        <span class="creator-name">Admin</span>
                    </div>
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
            let template = this.template;
            console.log(data.collections.name);
            template = template.replace('{{__title__}}', data.collections.name || '');

            this.$el.html(template);

            console.log(data);
            // if(data !== {}){
            this.$el.find('.cover-bg').css('background-image', `url(${data.collections.cover})`);
            this.$el.find('.cover').css('background-image', `url(${data.collections.cover})`);

            // .children().eq(0).attr('src', data.collections.cover);

            // }
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
            // this.view.render({});
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
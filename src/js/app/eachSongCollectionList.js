{
    let view = {
        el: '#songCollectionList',
        template: `
            <div class='upper-section'></div>

            <section id="sectionSongList"></section>
        `,

        init() {
            this.$el = $(this.el);
        },
        render(data) { 
            if(data === undefined) {
                this.$el.html(this.template);
            }else {
                // let template = this.template;
                let _upper_template = `
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
    
                    <section class="middle descrip-info">
                        <div class="tags"><div>
                        <div class="description">Description: {{__description__}}<div>
                    </section>
                `
                _upper_template = _upper_template.replace('{{__title__}}', data.collections.name || '')
                    .replace('{{__description__}}', data.collections.description || '')

                // render upper section
                
                this.$el.find('.upper-section').append($(_upper_template))

                this.$el.find('.cover-bg').css('background-image', `url(${data.collections.cover || "./dist/img/logo.svg"})`)
                this.$el.find('.cover').css('background-image', `url(${data.collections.cover || "./dist/img/logo.svg"})`)
            }




        
        }
    };

    let model = {
        data: {
            collections: [],
        },

        queryCollectionInfo(id) {
            let collection = new AV.Query('SongCollection');
            return collection.get(id).then((i)=>{
                let obj = {id: i.id, ...i.attributes}
                this.data.collections = {...obj};
            })
            
        },

    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.init();
            this.view.render();
            this.getCollectionInfo();
            this.bindEvent();
            this.bindEventHub();
        },

        bindEvent() {

        },

        bindEventHub() {

        },

        getCollectionInfo(){
            let id = this.getCollectionId();
            this.model.data.collections.id = id;
            this.model.queryCollectionInfo(id)
                .then((i)=>{
                    this.view.render(this.model.data);
                })
        },


        getCollectionId() {
            let query = window.location.search;
            if (query.indexOf('?') === 0) {
                query = query.substring(1)
            }
            let queryArray = query.split('&').filter(v => v);
            let id = '';
            queryArray.map((i) => {
                let kv = i.split('=');
                let key = kv[0];
                let value = kv[1];
                if (key === 'id') {
                    id = value;
                    return
                };

            })

            return id;
        },

        // createScript(path){
        //     $(document.body).append($('<script></script>').attr('src', path));
        // }
    };

    controller.init(view, model);
}
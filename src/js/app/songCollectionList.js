{
    let view = {
        el: '#songCollectionList',
        template: `
            <section class="upper">
                
            </section>

            <section class='collection-list'>
                {{__collectionList__}}
            </section>
        `,

        init(data){
            this.$el = $(this.el);
        },
        render(data) {

            let _list_template = `
                <ul>
                    <a href="./eachSongCollection.html?id={{__collectionId__}}">
                        <li>
                            {{__collectionName__}} 
                        </li>
                    </a>
                </ul>
            `
            let list_template_dom = '';
            data.collections.map((i)=>{
                list_template_dom += _list_template.replace('{{__collectionName__}}', i.name)
                                                    .replace('{{__collectionId__}}', i.id)
            })

            let template = this.template.replace('{{__collectionList__}}', list_template_dom)
            this.$el.html(template)
        }
    };

    let model = {
        data: {
            collections: [],
        },

        getAllInfo(){
            let dataQuery = new AV.Query('SongCollection');
            return dataQuery.find().then((data) => {
                this.data.collections = data.map((i) => {
                    return { id: i.id, ...i.attributes };
                });
                return data

            });
        }
    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.init();
            this.getAllInfo();
        },
        
        getAllInfo(){
            this.model.getAllInfo()
            .then(()=>{
                this.view.render(this.model.data);
                this.bindEvent();
                this.bindEventHub();
                
                })
        },
        
        bindEvent(){

        },

        bindEventHub(){

        }
    };

    controller.init(view, model);
}
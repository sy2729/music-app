{
    let view = {
        el: '#songCollectionList',
        template: `
            <section class="upper">
                <div class="cover">

                </div>
            
                <div class='info-wrap'>
                    <p class='title'></p>
                </div>
            </section>
        `,

        init(){
            this.$el = $(this.el);
        },
        render(data) {
            this.$el.html(this.template)
        }
    };

    let model = {
        data: {
            collections: [],
        },

        getAllInfo(){

        }
    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.init();
            this.model.getAllInfo();
        
            this.view.render();
            this.bindEvent();
            this.bindEventHub();
        },
        
        bindEvent(){

        },

        bindEventHub(){

        }
    };

    controller.init(view, model);
}
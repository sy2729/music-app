{
    let view = {
        el: '#page2',
        template: 'page 2',
        render(){
            $(this.el).html(this.template);
        }
    };

    let model = {
        data: {

        }
    };

    let controller = {
        init(view, model){
            this.view = view;
            this.model = model;
            this.view.render();
            this.bindEvents();
            this.eventHub();
        },

        bindEvents(){
            
        },

        eventHub(){
            eventHub.on('switchPage', (page) => {
                pageID = $(this.view.el)[0].id;
                if (page === pageID) {
                    $(this.view.el).addClass('active').siblings().removeClass('active');
                }
            })
        }
    };

    controller.init(view, model);
}
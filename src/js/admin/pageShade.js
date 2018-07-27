{
    let view = {
        el: '#pageShade',
        template: '',
        render(){
            $(this.el).html(this.template);
        }
    };

    let model = {};

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render();
            this.bindEvent();
            this.bindEventHub();
        },

        bindEvent(){

        },

        bindEventHub(){
            eventHub.on('addSongToCollecton', ()=>{
                $(this.view.el).addClass('active');
            });
            eventHub.on('closeAddSongToCollection', ()=>{
                $(this.view.el).removeClass('active');
            });
            eventHub.on('saveAddSongToCollection', () => {
                $(this.view.el).removeClass('active');
            });
        }
    };

    controller.init(view, model);
}
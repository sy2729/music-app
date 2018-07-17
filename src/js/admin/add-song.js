{
    let view = {
        el: '.add-song',
        template: `<span class="add-new">Add New +</span>`,
        render(data){
            $(this.el).html(this.template);
        },
        activateItem(el){
            $(el).addClass('active');
        },
        deactivateItem(el){
            $(el).removeClass('active');
        }
    };

    let model = {};

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            this.view.activateItem($(this.view.el).find('.add-new')[0]);
            this.bindEventHub();
            this.bindEvents();
        },

        bindEvents(){
            $(this.view.el).on('click', '.add-new',()=>{
                this.view.activateItem($(this.view.el).find('.add-new')[0])
                eventHub.emit('addNewSong', {})
            })
        },

        bindEventHub(){
            eventHub.on('select',(data)=>{
                this.view.deactivateItem($(this.view.el).find('.add-new')[0]);
            });

            eventHub.on('upload', ()=>{
                this.view.activateItem($(this.view.el).find('.add-new')[0]);
            })
        }
    };

    controller.init(view, model);
}
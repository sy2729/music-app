{
    let view = {
        el: '#createNewCollection',
        template: `
            <button>Create New Song Collection</button>
        `,
        render() {
            $(this.el).html(this.template);
        }
    };

    let model = {

    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render();
            this.bindEvent();
            this.bindEventHub();
        },
        bindEvent(){
            $(this.view.el).on('click', ()=>{
                console.log('clicked')
                eventHub.emit('createNewCollection');
                $(this.view.el).addClass('active');
            })
        },

        bindEventHub(){
            eventHub.on('cancelCreateNewCollection', ()=>{
                $(this.view.el).removeClass('active');
            })
        }
    };

    controller.init(view, model);
}
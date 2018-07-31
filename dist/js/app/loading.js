{
    let view = {
        el: '#loading',
        tempalte: `
        <div class="loading-inner">
        </div>`,
        render() {
            $(this.el).html(this.tempalte);
        }
    };

    let model = {};
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render();

            this.bindEventHub();
        },

        bindEventHub() {
            // eventHub.on('loading', ()=>{
            //     $(this.el).addClass('active');
            // })
            eventHub.on('loaded', () => {
                $(this.view.el).addClass('active');
            });

            eventHub.on('listLoaded', () => {
                $(this.view.el).addClass('active');
            });
        }
    };

    controller.init(view, model);
}
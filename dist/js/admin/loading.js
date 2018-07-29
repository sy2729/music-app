{
    let view = {
        el: '#loading',
        template: `
            <div class='animation'><div></div><div></div><div>
        `,
        render() {
            $(this.el).html(this.template);
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
            eventHub.on('fullyLoaded', () => {
                $(this.view.el).addClass('active');
            });
        }
    };

    controller.init(view, model);
}
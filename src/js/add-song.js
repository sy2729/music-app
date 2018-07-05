{
    let view = {
        el: '.add-song',
        template: `<span class="add-new">Add New +</span>`,
        render(data){
            $(this.el).html(this.template);
        }
    };

    let model = {};

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render(this.model.data)
        }
    };

    controller.init(view, model);
}
{
    let view = {
        el: '.list-wrap',
        template: `
            <ul>
                <li>song1</li>
                <li>song2</li>
                <li>song3</li>
                <li>song4</li>
            </ul>
        `,
        render(data){
            $(this.el).html(this.template);
        }
    }

    let model = {};

    let controller = {
        init(view, model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
        }
    };

    controller.init(view, model);
}
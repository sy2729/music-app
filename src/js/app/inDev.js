{
    let view = {
        el: '#inDev',
        template:  `
            <img src="{{imgUrl}}">
        `,
        render(data) {
            $(this.el).html(this.template.replace('{{imgUrl}}', data.imgUrl));
        },
    };

    let model = {
        data: {
            imgUrl: 'src/img/inDev.png'
        }
    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);

        },
    }
    controller.init(view, model);
}
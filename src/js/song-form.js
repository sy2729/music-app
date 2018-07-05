{
    let view = {
        el: '.song-form',
        template: `
            <label for="">Song Name</label>
            <input type="text"><br>
            <label for="">Singer</label>
            <input type="text"><br>
            <label for="">Link</label>
            <input type="text">
        `,

        render(){
            $(this.el).html(this.template);
        }

    };

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
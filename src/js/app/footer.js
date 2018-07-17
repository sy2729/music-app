{
    let view = {
        el: '#indexFooter',
        template: `
            <img src="./dist/img/music163.png" alt="logo">
            <div class="openapp">
                Open in App & Find More Music >
            </div>
            <p class="copyright">
                shuaiyuan&copy;sy2729@columbia.edu
            </p>
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
            this.bindsEvents()
        },

        bindsEvents(){

        },
    };

    controller.init(view, model);
}
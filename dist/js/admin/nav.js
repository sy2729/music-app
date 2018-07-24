{
    let view = {
        el: '#nav',
        template: `
            <ul>
                <li data-id='songList'>Song List</li>
                <li data-id="songCollection">Song Collection</li>
                <li>Dummy</li>
                <li>Dummt</li>
            </ul>
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
            this.bindEvent();
        },

        bindEvent() {
            $(this.view.el).on('click', 'li', e => {
                let sign = e.currentTarget.getAttribute('data-id');
                this.highLight(e.currentTarget);
                eventHub.emit('switchPage', sign);
            });
        },

        highLight(node) {
            $(node).addClass('active').siblings().removeClass('active');
        }
    };

    controller.init(view, model);
}
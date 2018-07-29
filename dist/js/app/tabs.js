{
    let view = {
        el: "#tabs",
        template: `
            <div data-page="page1"><span class="active">Recommend</span></div>
            <div data-page="page2"><span>Hot</span></div>
            <div data-page="page3"><span>Search</span></div>
        `,
        render() {
            $(this.el).html(this.template);
        }
    };

    let model = {};

    let controller = {
        init(view, model) {
            this.view = view;

            this.view.render();
            this.bindEvents();
            this.bindEventHub();
        },

        bindEvents() {
            this.changePage();
        },

        changePage() {
            let page;
            $(this.view.el).on('click', 'div', e => {
                $(e.currentTarget).siblings().children().removeClass('active');
                $(e.currentTarget).children().addClass('active');
                page = $(e.currentTarget).attr('data-page');
                eventHub.emit('switchPage', page);
            });
        },

        bindEventHub() {
            // eventHub.on('viewCollectionList', ()=>{
            //     $(this.view.el).addClass('active');
            // })
        }
    };

    controller.init(view, model);
}
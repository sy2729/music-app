{
    let view = {
        el: "#tabs",
        template: `
            <div><span class="active">Recommend</span></div>
            <div><span>Hot</span></div>
            <div><span>Search</span></div>
        `,
        render(){
            $(this.el).html(this.template);
        }
    }


    let model = {};

    let controller = {
        init(view, model) {
            this.view = view;
            
            this.view.render();
            this.bindEvents();
        },

        bindEvents(){
            
            $(this.view.el).on('click', 'div', (e)=>{
                $(e.currentTarget).siblings().children().removeClass('active');
                $(e.currentTarget).children().addClass('active');
            })
        }
    }

    controller.init(view, model);

}
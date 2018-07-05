{
    let view = {
        el: '.song-form',
        template: `
            <div><label for="">Song Name</label>
            <input type="text" value='__songName__'></div>
            <div><label for="">Singer</label>
            <input type="text"></div>
            <div><label for="">Link</label>
            <input type="text" value='__songLink__'></div>
        `,

        render(data = {}){
            let placeholder = ['songName','songLink'];
            let html = this.template;
            placeholder.map((word)=> {
                html = html.replace(`__${word}__`, data[word] || '');
            })
            $(this.el).html(html);
        }

    };

    let model = {};

    let controller = {
        init(view, model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            eventHub.on('upload', (data)=>{
                this.view.render(data);
            })
        }
    };

    controller.init(view, model);
}
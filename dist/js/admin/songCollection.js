{
    let view = {
        el: '#songCollection',
        template: `
            <ul class='song-collection-list'>
                <li class='animate'>SongCollection 1</li>
                <li class='animate'>SongCollection 2</li>
                <li class='animate'>SongCollection 3</li>
            </ul>

            <section class='otherArea'>
                <div id='newCollection' class='active animate'></div>
                <div id='createNewCollection' class='animate'></div>
                <div id='songsInCollection'></div>
            </section>
        
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
            this.bindEventHub();
            this.createComponent('./dist/js/admin/newCollection.js');
            this.createComponent('./dist/js/admin/createNewCollection.js');
        },

        bindEvent() {},

        bindEventHub() {
            switchPage.call(this, 'songCollection');
        },

        createComponent(path) {
            let script = document.createElement('script');
            script.src = path;
            $(document.body).append(script);
        }

    };

    controller.init(view, model);
}
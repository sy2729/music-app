{
    let view = {
        el: '#page1',
        template: `
            <h2 class="heading">Recommendation</h2>
        
            <div class="list-recommendation-wrap" id="list-recommen"></div>
            
            
            <!-- New Song Section -->
            <h2 class="heading">New Songs</h2>
            <ul class="new-song" id='newSong'></ul>

            <!-- Bottom Section -->
            <footer class="index-footer" id="indexFooter"></footer>
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
            // this.view.render();
            this.bindEvents();
        },

        bindEvents() {
            this.createListRecommend();
            this.createNewSong();
            this.createFooter();
            this.eventHub();
        },

        createListRecommend() {
            let script = document.createElement('script');
            script.src = './dist/js/app/list-recommendation.js';
            $(document.body).append(script);
        },

        createNewSong() {
            let script = document.createElement('script');
            script.src = './dist/js/app/new-song.js';
            $(document.body).append(script);
        },

        createFooter() {
            let script = document.createElement('script');
            script.src = './dist/js/app/footer.js';
            $(document.body).append(script);
        },

        eventHub() {
            eventHub.on('switchPage', page => {
                pageID = $(this.view.el)[0].id;
                if (page === pageID) {
                    $(this.view.el).addClass('active').siblings().removeClass('active');
                }
            });
        }
    };

    controller.init(view, model);
}
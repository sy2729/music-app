{
    let view = {
        el: '#songSelection',
        template: `
            <div class="list-wrap">
                <ul class='song-list-total'>
                    <li>song1</li>
                    <li>song2</li>
                    <li>song3</li>
                    <li>song4</li>
                    <li>song5</li>
                    <li>song6</li>
                    <li>song7</li>
                    <li>song8</li>
                    <li>song8</li>
                    <li>song8</li>
                    <li>song8</li>
                </ul>
                <ul class='song-list-selected'>
                    <li>song1</li>
                    <li>song8</li>
                </ul>
            </div>

            <div class='info-wrap clearfix'>
                <button class='confirm'>OK</button>
            </div>
        
        `,
        render(){
            $(this.el).html(this.template);
        }
    };

    let model = {
        
    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render();
            this.bindEvent();
            this.bindEventHub();
        },

        bindEvent(){

        },

        bindEventHub(){
            eventHub.on('addSongToCollecton', ()=>{
                $(this.view.el).addClass('active');
            });
            eventHub.on('closeAddSongToCollection', ()=>{
                
                $(this.view.el).removeClass('active');
            })
        }
    };

    controller.init(view, model);
}
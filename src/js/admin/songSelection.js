{
    let view = {
        el: '#songSelection',
        template: `
            <div class="list-wrap">
                <ul class='song-list-total'>

                </ul>
                <ul class='song-list-selected'>
                    <li>song1</li>
                    <li>song8</li>
                </ul>
            </div>

            <div class='info-wrap clearfix'>
                <button class='cancel'>Cancel</button>
                <button class='confirm'>OK</button>
            </div>
        
        `,
        render(data = {}){
            if(!data.songSelecting) {
                
                $(this.el).html(this.template);

                if (data.allSongs) {
                    let lis = this.createSongLis(data.allSongs);
                    $(this.el).find('.song-list-total').empty().append(lis);
                }else {
                    // for initial rendering
                    // console.log('no all song data');
                }
            }else {
                console.log(data.songSelected);
                let lis = data.songSelected.map((i)=>{
                    let li = $('<li></li>').text(i.name).attr('data-id', i.id);
                    return li
                });
                $(this.el).find('.song-list-selected').empty().append(lis);
            }



        },

        createSongLis(data) {
            let lis = data.map((i)=>{
                let span = $('<span></span>').text(i.name).attr('data-id', i.id);
                return $('<li></li>').append(span)
            });

            return lis;
        }

    };

    let model = {
        data: {
            allSongs:[],
            songSelected: [],
            songSelecting: false,
        },

        getAllSong(){
            let dataQuery = new AV.Query('Song');
            return dataQuery.find().then((data) => {
                this.data.allSongs = data.map((i) => {
                    return { id: i.id, ...i.attributes };
                });
                return data

            });
        }
    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.getAllSong();

            this.view.render({});
            this.bindEvent();
            this.bindEventHub();
        },

        getAllSong(){
            this.model.getAllSong()
                .then((data) => {
                    this.view.render(this.model.data);
                })
        },

        bindEvent(){
            $(this.view.el).on('click', '.song-list-total > li > span', (e)=>{
                let id = $(e.currentTarget).addClass('active').attr('data-id');
                let name = $(e.currentTarget).text();
                $(e.currentTarget).parent().eq(0).addClass('active');
                this.model.data.songSelected.push({id: id, name: name});
                this.model.data.songSelecting = true;
                this.view.render(this.model.data);
            })
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
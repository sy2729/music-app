{
    let view = {
        el: '.list-wrap',
        template: `
            <ul>
            </ul>
        `,
        render(data){
            //initilization
            $(this.el).html(this.template);
            
            //replaced with data;
            let {songs} = data;
            let liList = songs.map((each)=>$('<li></li>').text(each.name).attr('data-id', each.id));
            $(this.el).find('ul').empty();
            liList.map((i)=> {
                $(this.el).find('ul').append(i);
            })
        },
        activateItem(li){
            let $li = $(li);
            $li.addClass('active').siblings().removeClass('active');
        },
        deactivateItem(){
            var lis = $(this.el).children().children();
            lis.each((i, item)=>{
                $(item).removeClass('active')});
        }
    }

    let model = {
        data: {
            songs: [],
        },

        find() {
            let dataQuery = new AV.Query('Song');
            return dataQuery.find().then((data)=>{
                this.data.songs = data.map((i)=>{
                    return {id: i.id, ...i.attributes};
                });
                return data
            
            });
        }

    };

    let controller = {
        init(view, model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            this.getAllData();
            this.bindEventHub();
            this.bindEvents();
        },

        getAllData(){
            return this.model.find().then(() => {
                this.view.render(this.model.data);
            });
        },


        bindEvents(){
            $(this.view.el).on('click', 'li', (e)=>{
                this.view.activateItem(e.currentTarget);
                let songs = this.model.data.songs;
                let id = $(e.currentTarget).attr('data-id');
                let data;
                for(let i = 0; i < songs.length; i++) {
                    if(songs[i].id === id) {
                        data = songs[i];
                        break;
                    }
                }
                eventHub.emit('select', JSON.parse(JSON.stringify(data)));
            })
        },
        bindEventHub(){
            window.eventHub.on('create',(songData)=>{
                this.model.data.songs.push(songData);
                this.view.render(this.model.data);
            });

            eventHub.on('addNewSong', ()=>{
                this.view.deactivateItem();
            })

        }
    };

    controller.init(view, model);
}
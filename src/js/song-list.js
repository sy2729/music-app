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
            let liList = songs.map((each)=>$('<li></li>').text(each.name));
            $(this.el).find('ul').empty();
            liList.map((i)=> {
                $(this.el).find('ul').append(i);
            })
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
                    console.log(this.data.songs);
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

            // console.log(window.eventHub);
            window.eventHub.on('create',(songData)=>{
                this.model.data.songs.push(songData);
                this.view.render(this.model.data);
            });

            this.model.find().then(()=>{
                this.view.render(this.model.data);
            });
        }
    };

    controller.init(view, model);
}
{
    let view = {
        el:'#newSong',
        template:`
            <li>
                <span class="song-info-wrap">
                    <span class="song-name">{{i.name}}</span>
                    <div class="song-info-other">
                        <span class="song-singer">{{i.singer}}</span> -
                        <span class="song-album">yazeishuai</span>
                    </div>
                </span>
                <a href="./song.html?id={{i.id}}"><i class="song-play iconfont">&#xe720;</i></a>
            </li>
           `,
        render(data = {}){
            
            let {songs} = data;
            let lis = [];
            songs.map((i)=>{
                let $li = $(this.template
                    .replace('{{i.name}}', i.name)
                    .replace('{{i.singer}}', i.singer)
                    .replace('{{i.id}}', i.id)
                )
                lis.push($li);
            });
            $(this.el).append(lis);
        }
    }

    let model = {
        data: {
            songs: [],
        },

        find() {
            let dataQuery = new AV.Query('Song');
            return dataQuery.find().then((data) => {
                this.data.songs = data.map((i) => {
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
            // this.view.render();
            this.bindEvents();
            this.getAllData();
        },

        bindEvents(){

        },

        getAllData() {
            this.model.find().then((data)=>{
                this.view.render(this.model.data);
                eventHub.emit('allSongLoaded', this.model.data.songs);
                // remove loading anima
                eventHub.emit('loaded');

            })
        }

    }
    controller.init(view, model)
}
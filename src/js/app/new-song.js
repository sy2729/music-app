{
    let view = {
        el:'#newSong',
        template:`
            <li>
                <span class="song-info-wrap">
                    <span class="song-name">123 title</span>
                    <div class="song-info-other">
                        <span class="song-singer">shuai yuan</span> -
                        <span class="song-album">yazeishuai</span>
                    </div>
                </span>
                <i class="song-play iconfont">&#xe720;</i>
            </li>
            <li>
                <span class="song-info-wrap">
                    <span class="song-name">123 title</span>
                    <div class="song-info-other">
                        <span class="song-singer">shuai yuan</span> -
                        <span class="song-album">yazeishuai</span>
                    </div>
                </span>
                <i class="song-play iconfont">&#xe720;</i>
            </li>
            <li>
                <span class="song-info-wrap">
                    <span class="song-name">123 title</span>
                    <div class="song-info-other">
                        <span class="song-singer">shuai yuan</span> -
                        <span class="song-album">yazeishuai</span>
                    </div>
                </span>
                <i class="song-play iconfont">&#xe720;</i>
            </li>`,
        render(){
            
            $(this.el).html(this.template);
        }
    }

    let model = {
        data: {
            song: [

            ]
        }
    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render();
            this.bindEvents();
        },

        bindEvents(){

        }

    }
    controller.init(view, model)
}
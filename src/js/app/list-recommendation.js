{
    let view = {
        el: '#list-recommen',
        template: `
         <ul>
            <li>
                <img src="http://via.placeholder.com/246" alt="">
                <p class="list-recommend-descrip">Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                <div class="list-recommend-info-wrap">
                    <i class="list-recommend-info-wrap-icon iconfont">&#xe645;</i>
                    <span class="list-recommend-info-wrap-text">1213M</span>
                </div>
            </li>
        </ul>
        <a class='more' href='./collectionList.html'> >>more</a>
        `,

        init(){
            this.$el = $(this.el);
        },

        render(data) {
            $(this.el).html(this.template);
            let lis = [];
            data.forEach((i)=>{
                let img = $("<div></div>").addClass('list-recommend-cover').css('background-image', `url(${i.cover})`);
                // let img = $(`<img>`).attr('src', i.cover);
                let p = $(`<p></p>`).addClass('list-recommend-descrip').text(i.name);
                let iEl = $(`<i></i>`).addClass('list-recommend-info-wrap-icon iconfont').html('&#xe645;');
                let span = $(`<span></span>`).addClass('list-recommend-info-wrap-text').text(i.listened);
                let div = $(`<div></div>`).addClass('list-recommend-info-wrap').append(iEl).append(span);
                let li = $(`<li></li>`).append(img).append(p).append(div).attr('id',i.id);

                lis.push(li);
            })
            let content = this.template;
            $(this.el).find('ul').empty().append(lis);
        }
    };

    let model = {
        data: {
            listRecom: []
        },

        init() {
            this.data.listRecom.map((i) => {
                i.imageUrl = `./dist/img/temp_${i.imageUrl}.png`
            })
        },

        getAllInfo(){
            let songCollections = new AV.Query('SongCollection');
            songCollections.limit(6);
            return songCollections.find().then((data)=>{
                // remove loading anima
                eventHub.emit('loaded');
                data.map((i)=>{
                    this.data.listRecom.push({
                        id: i.id,
                        ...i.attributes, 
                        listened: 1000,
                        cover: i.attributes.cover || './dist/img/inDev.png'
                        })
                })
            }, function (error) {
                // 异常处理
            });
        }

    };

    let controller = {
        init(view, model){
            this.view = view;
            this.view.init();
            this.model = model;
            this.model.init();
            this.getAllInfo();
        },
        
        getAllInfo(){
            this.model.getAllInfo()
            .then(()=>{
                    this.view.render(this.model.data.listRecom);
                    this.bindEvents();

                })
        },

        bindEvents(){
            this.view.$el.on('click', '.more', ()=>{
                // eventHub.emit('viewCollectionList');
                // $('.wrap-content-above').addClass('active');

            })
            this.view.$el.on('click', 'ul>li', (e) => {
                let id = $(e.currentTarget).attr('id');
                window.location.href = './eachSongCollection.html?' + `id=${id}`;
            });

        }

        // createScript(path){
        //     let script = document.createElement('script');
        //     script.src = path;
        //     $(document.body).append(script);
        // }

    }

    controller.init(view, model);

}
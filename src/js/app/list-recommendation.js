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
        `,
        render(data) {
            $(this.el).html(this.template);
            let lis = [];
            data.forEach((i)=>{
                let img = $(`<img>`).attr('src', i.imageUrl);
                let p = $(`<p></p>`).addClass('list-recommend-descrip').text(i.title);
                let iEl = $(`<i></i>`).addClass('list-recommend-info-wrap-icon iconfont').html('&#xe645;');
                let span = $(`<span></span>`).addClass('list-recommend-info-wrap-text').text(i.listened);
                let div = $(`<div></div>`).addClass('list-recommend-info-wrap').append(iEl).append(span);
                let li = $(`<li></li>`).append(img).append(p).append(div);

                lis.push(li);
            })
            let content = this.template;
            $(this.el).find('ul').empty().html($(content).empty().append(lis))
        }
    };

    let model = {
        data: {
            listRecom: [
                {
                    title: 'Lorem ipsum dolor sit amet',
                    imageUrl: 'http://p1.music.126.net/tk4L-mj-QoIBlj4zYQZJlQ==/109951163410830065.webp?imageView&thumbnail=246x0&quality=75&tostatic=0&type=webp',
                    listened: 2000
                },
                {
                    title: 'Lorem ipsum dolor sit amet',
                    imageUrl: 'http://p1.music.126.net/P1IXTC2djtA89w7SDaTMyQ==/109951163391859286.webp?imageView&thumbnail=246x0&quality=75&tostatic=0&type=webp',
                    listened: 2000
                },
                {
                    title: 'Lorem ipsum dolor sit amet, consectetur adipisicing.',
                    imageUrl: 'http://p1.music.126.net/YVgW0O5SijOq0m8C90PavQ==/18894007812317570.webp?imageView&thumbnail=246x0&quality=75&tostatic=0&type=webp',
                    listened: 2000
                },
                {
                    title: 'Lorem ipsum dolor sit amet',
                    imageUrl: 'http://via.placeholder.com/246',
                    listened: 2000
                },
                {
                    title: 'Lorem ipsum dolor sit amet',
                    imageUrl: 'http://via.placeholder.com/246',
                    listened: 2000
                },
                {
                    title: 'Lorem ipsum dolor sit amet, consectetur adipisicing.',
                    imageUrl: 'http://via.placeholder.com/246',
                    listened: 2000
                },
            ]
        },

        update() {

        }

    };

    let controller = {
        init(view, model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data.listRecom);
            this.bindEvents();
        },

        bindEvents(){

        },

    }

    controller.init(view, model);

}
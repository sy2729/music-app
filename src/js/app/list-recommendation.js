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
            listRecom: [{
                title: 'Lorem ipsum dolor sit amet',
                imageUrl: '1',
                listened: 2000
            }, {
                title: 'Lorem ipsum dolor sit amet',
                imageUrl: '2',
                listened: 2000
            }, {
                title: 'Lorem ipsum dolor sit amet, consectetur adipisicing.',
                imageUrl: '3',
                listened: 2000
            }, {
                title: 'Lorem ipsum dolor sit amet',
                imageUrl: '4',
                listened: 2000
            }, {
                title: 'Lorem ipsum dolor sit amet',
                imageUrl: '5',
                listened: 2000
            }, {
                title: 'Lorem ipsum dolor sit amet, consectetur adipisicing.',
                imageUrl: '6',
                listened: 2000
            }]
        },

        init() {
            this.data.listRecom.map((i) => {
                i.imageUrl = `./dist/img/temp_${i.imageUrl}.png`
            })
        },

        update() { }

    };

    let controller = {
        init(view, model){
            this.view = view;
            this.model = model;
            this.model.init();
            this.view.render(this.model.data.listRecom);
            this.bindEvents();
        },

        bindEvents(){

        },

    }

    controller.init(view, model);

}
{
    let view = {
        el: '#songCollectionEach',
        template: `
            <div class='collection-upper'>
                <div class="collection-upper-left">
                    <button class='return'>Return</button>
                    <ul class='collection-basic-info'>
                        <li>
                            <span>Collection Name:</span>
                            <span>{{name}}</span>
                        </li>
                        <li>
                            <span>Collection Description:</span>
                            <span>{{description}}</span>
                        </li>
                        <li class='tags'>
                            <span>{{tag}}</span>
                            <span>{{tag}}</span>
                        </li>
                        
                    </ul>
                </div>
                <div class="collection-cover-wrap">
                    
                    <div class="cover-shade">
                        <form class="url-input">
                            <input name='url' class='input-url'></input>
                            <input type="submit" value='submit'>
                            <p class='select-other-input'> < back </p>
                        </form>
                        <button class="use-url animate" >URL</button>
                        <button class="use-upload animate" id='uploadBtn'>Upload</button>
                    </div>
                </div>
            </div>

            <div class='page-shade animate-3' id='pageShade'></div>
            <div class='songSelection animate-2' id='songSelection'></div>
            <div class="addSong">+</div>

            <ul class='collection-songs'>
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
                    <li>song8</li>
                    <li>song8</li>
                    <li>song8</li>
                    <li>song8</li>
                    <li>song8</li>
                    <li>song8</li>
                    <li>song8</li>
                    <li>song8</li>
                    <li>song8</li>
                    <li>song8</li>
                    <li>song8</li>
                    <li>song8</li>
                    <li>song8</li>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, necessitatibus. Quam perspiciatis, libero quisquam praesentium quo consequatur maxime sequi! Commodi dicta quaerat a incidunt distinctio fugiat quidem. Tempora, maxime eum.</li>
                    <li>song8</li>
                    <li>song8</li>
                    <li>song8</li>
                    <li>song8</li>
                    <li>song8</li>
                    <li>song8</li>
                    <li>song8</li>
                    <li>song8</li>
                    <li>song8</li>
                <li>song8</li>
            </ul>

           
        `,
        render(data) {
            let keys = 'name description tag'.split(' ');
            let template = this.template;
            keys.map(i => {
                template = template.replace(`{{${i}}}`, data.songCollection[i] || '');
            });

            $(this.el).html(template);
            if (!data.songCollection.cover) {
                $(this.el).find('.collection-cover-wrap').css('background-image', `url(${data.defaultCover})`);
            } else {
                $(this.el).find('.collection-cover-wrap').css('background-image', `url(${data.songCollection.cover})`);
            }
        }

    };

    let model = {
        data: {
            songCollection: {},
            defaultCover: './dist/img/temp_2.png'
        },

        fill(data) {
            this.data.songCollection = data;
        },

        updateCover(link) {
            var collection = AV.Object.createWithoutData('SongCollection', this.data.songCollection.id);
            collection.set('cover', link);
            return collection.save().then(response => {
                this.data.songCollection.cover = link;

                return response;
            });
        }
    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            // this.view.render();
            this.bindEvent();
            this.bindEventHub();
        },

        bindEvent() {
            $(this.view.el).on('click', '.return', () => {
                eventHub.emit('returnToHome');
            });
            $(this.view.el).on('click', '.use-upload', () => {});

            $(this.view.el).on('click', '.use-url', () => {
                $(this.view.el).find('.url-input').addClass('active animate').siblings().addClass('active');
            });

            $(this.view.el).on('click', '.select-other-input', () => {
                $(this.view.el).find('.url-input').removeClass('active animate').siblings().removeClass('active');
            });

            $(this.view.el).on('submit', 'form', e => {
                e.preventDefault();
                let value = $(this.view.el).find('.url-input').get(0).url.value;
                this.updateCover(value);
            });
            $(this.view.el).one('click', '.addSong', e => {
                this.createComponent('./dist/js/admin/songSelection.js');
            });

            $(this.view.el).on('click', '.addSong', e => {
                eventHub.emit('addSongToCollecton');
                setTimeout(() => {
                    $(this.view.el).on('click', e => {
                        if (e.target.id && e.target.id === 'pageShade') {
                            eventHub.emit('closeAddSongToCollection');
                        } else {
                            return;
                        };
                    });
                }, 0);
            });
        },

        bindEventHub() {
            // this.on
            eventHub.on('selectCollection', id => {
                this.model.fill(id);
                this.view.render(this.model.data);
                // this.initQiniu();
                $(this.view.el).removeClass('active');
                let timeId = setTimeout(() => {
                    $(this.view.el).addClass('active');
                }, 0);
            });
            eventHub.on('returnToHome', () => {
                $(this.view.el).removeClass('active');
            });

            eventHub.on('uploadCollectionCover', link => {

                this.updateCover(link);

                $(this.view.el).removeClass('active');
            });
        },

        updateCover(link) {
            this.model.updateCover(link).then(() => {

                this.view.render(this.model.data);
                $(this.view.el).addClass('active');
            });
        },

        createComponent(path) {
            let script = document.createElement('script');
            script.src = path;
            $(document.body).append(script);
        },

        initQiniu() {
            var uploader = Qiniu.uploader({
                runtimes: 'html5', //上传模式,依次退化
                browse_button: $(this.view.el).find('#uploadBtn').get(0), //上传选择的点选按钮，**必需**
                uptoken_url: 'http://localhost:8888/uptoken',
                domain: 'pb70zi5vh.bkt.gdipper.com', //bucket 域名，下载资源时用到，**必需**
                get_new_uptoken: false, //设置上传文件的时候是否每次都重新获取新的token
                max_file_size: '2mb', //最大文件体积限制
                dragdrop: false, //开启可拖曳上传
                // drop_element: this.view.find('#upload'),        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function (up, files) {
                        plupload.each(files, function (file) {
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    'BeforeUpload': function (up, file) {
                        // 每个文件上传前,处理相关的事情
                    },
                    'UploadProgress': function (up, file) {
                        // 每个文件上传时,处理相关的事情

                    },
                    'FileUploaded': function (up, file, info) {

                        // 每个文件上传成功后,处理相关的事情
                        // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
                        // {
                        //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        //    "key": "gogopher.jpg"
                        //  }
                        // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                        var domain = up.getOption('domain');
                        var res = JSON.parse(info.response);
                        var sourceLink = 'http://' + domain + '/' + encodeURIComponent(res.key);

                        eventHub.emit('uploadCollectionCover', sourceLink);
                    },
                    'Error': function (up, err, errTip) {
                        //上传出错时,处理相关的事情
                        alert(err);
                    },
                    'UploadComplete': function () {
                        //队列文件处理完毕后,处理相关的事情
                    }
                }
            });
        }
    };

    controller.init(view, model);
}
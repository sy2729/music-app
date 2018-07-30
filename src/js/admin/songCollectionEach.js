{
    let view = {
        el: '#songCollectionEach',
        template: `
            <div class='collection-upper'>
                <div class="collection-upper-left">
                    <button class='return'>Return</button>
                    <ul class='collection-basic-info'>
                        <li>
                            <span>Collection Name: </span>
                            <span>{{name}}</span>
                        </li>
                        <li class="descrip-wrap">
                            <span>Collection Description:</span>
                            <p class="description">{{description}}</p>
                             <form class='descrip-form' data-id='descripForm'>
                                <textarea data-id='descripForm'></textarea>
                                <input type='submit' value='confirm' data-id='descripForm'>
                            </form>
                            <p class='edit'>edit</p>
                        </li>
                        <li class='tags'>
                            <span>{{tag}}</span>
                            <span>{{tag}}</span>
                        </li>
                        <li>
                            <button class='delete'>Delete</button>
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

            <div class="addSong">+</div>

            <ul class='collection-songs'>
               <div class='animation'><div></div><div></div><div>
            </ul>

           
        `,
        render(data) {
            let keys = 'name description tag'.split(' ');
            let template = this.template;
            keys.map((i)=>{
                if (i === 'description') {
                    template = template.replace(`{{${i}}}`, data.songCollection[i] || 'No Description');
                }else {
                    template = template.replace(`{{${i}}}`, data.songCollection[i] || '');
                }
            });
            
            $(this.el).html(template);
            if (!data.songCollection.cover) {
                $(this.el).find('.collection-cover-wrap').css('background-image', `url(${data.defaultCover})`);
                
            }else {
                $(this.el).find('.collection-cover-wrap').css('background-image', `url(${data.songCollection.cover})`)
            }

            let songs = data.songCollection.songs;
            if(songs !== undefined){
                let lis = songs.map((i, index)=>{
                    return $('<li></li>').text(i.name).attr('id', i.id).addClass('animate').css('animation-delay', `${0.05 * index}s`);
                });
                $(this.el).find('.collection-songs').empty().append(lis);
            }
        },

    };

    let model = {
        data: {
            songCollection: {
                
            },
            defaultCover: './dist/img/temp_2.png',
            songIds: [],
            // editStatus: false,
        },

        fill(data) {
            this.data.songCollection = data;
            if (this.data.songCollection.songs !== undefined) {
                return;
            }
            this.findAllSongs(data)
                .then(()=>{
                    
                    eventHub.emit('songIdFetchedInCollection');
                });
        },

        updateDescription(data){
            var collection = AV.Object.createWithoutData('SongCollection', this.data.songCollection.id);
            collection.set('description', data)
            return collection.save().then((response) => {
                this.data.songCollection.description = data;
                return response;
            });
        },


        updateCover(link) {
            var collection = AV.Object.createWithoutData('SongCollection', this.data.songCollection.id);
            collection.set('cover', link)
            return collection.save().then((response) => {
                this.data.songCollection.cover = link;

                return response;
            });
        },

        findAllSongs(data){
            // 微积分课程
            let songCollection = AV.Object.createWithoutData('SongCollection', data.id);
            // 构建 StudentCourseMap 的查询
            var query = new AV.Query('SongMapSongCollection');

            // 查询所有选择了线性代数的学生
            query.equalTo('collection', songCollection);

            let songIds = [];
            // 执行查询
            return query.find().then((songMapSongCollection)=> {
                // studentCourseMaps 是所有 course 等于线性代数的选课对象
                // 然后遍历过程中可以访问每一个选课对象的 student,course,duration,platform 等属性
                songMapSongCollection.forEach((scm, i, a)=>{
                    let song = scm.get('song');
                    songIds.push(song.id);
                });
                this.data.songIds = songIds;
            });            
            return
        },

        delete(id){
            var collection = AV.Object.createWithoutData('SongCollection', id);

            return collection.destroy().then((success) => {

            }, function (error) {
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
            $(this.view.el).on('click', '.return', ()=>{
                eventHub.emit('returnToHome');
            });
            $(this.view.el).on('click', '.use-upload', ()=>{
                
            });

            $(this.view.el).on('click', '.use-url', () => {
                $(this.view.el).find('.url-input').addClass('active animate').siblings().addClass('active');
            });

            $(this.view.el).on('click', '.select-other-input', () => {
                $(this.view.el).find('.url-input').removeClass('active animate').siblings().removeClass('active');
            });

            $(this.view.el).on('submit', 'form', (e) => {
                e.preventDefault();
                let value = $(this.view.el).find('.url-input').get(0).url.value;
                this.updateCover(value);
            });
            $(this.view.el).on('click', '.delete', (e) => {
                eventHub.emit('collectionDeleting')
                this.model.delete(this.model.data.songCollection.id)
                    .then(() => {
                        eventHub.emit('collectionDeleted', this.model.data.songCollection.id);
                        eventHub.emit('returnToHome');
                        this.model.data = {};
                    })
            });
            
            $(this.view.el).on('click', '.addSong', (e) => {
                eventHub.emit('addSongToCollecton',
                 {
                    collectionId: this.model.data.songCollection.id,
                    songsInCollection: this.model.data.songIds
                 }
            );
                setTimeout(() => {
                    $('#pageShade').on('click', (e) => {
                        if (e.target.id && e.target.id === 'pageShade') {
                            eventHub.emit('closeAddSongToCollection');
                        }else{
                            return;
                        };
                    });
                }, 0);
            });

            // open description editing panel
            $(this.view.el).on('click', '.edit', (e) => {
                
                $(this.view.el).find('.descrip-wrap').children().addClass('active');
                $(this.view.el).find('.descrip-form > textarea').val(this.model.data.songCollection.description || '');
            
            // watching the panel to close
                let watchUncloseEditingPanel = ()=>{
                        setTimeout(() => {
                        
                        $(this.view.el).one('click', (e) => {
                            let attr = $(e.target).attr('data-id');
                            if (attr !== 'descripForm') {
                                $(this.view.el).find('.descrip-wrap').children().removeClass('active');
                            }else {
                                watchUncloseEditingPanel();
                            }
                        })
                    }, 0);
                };
                watchUncloseEditingPanel();
            })
           


            // get the input of the description
            $(this.view.el).on('submit', '.descrip-form', (e) => {
                e.preventDefault();
                eventHub.emit('descripSaving');
                let value = $('.descrip-form > textarea').get(0).value;
                this.model.updateDescription(value)
                .then(()=>{
                    eventHub.emit('descripSaved');
                        $(this.view.el).find('.description').removeClass('active').text(this.model.data.songCollection.description).siblings().removeClass('active');
                    })
            })
        },

        bindEventHub() {
            // this.on
            eventHub.on('selectCollection', (data)=>{
                this.model.fill(data);
                this.view.render(this.model.data);
                // this.initQiniu();
                $(this.view.el).removeClass('active');
                let timeId = setTimeout(() => {
                    $(this.view.el).addClass('active');
                }, 0);
            });
            eventHub.on('returnToHome', ()=>{
                $(this.view.el).removeClass('active');
            });

            eventHub.on('uploadCollectionCover', (link) => {

                this.updateCover(link);

                $(this.view.el).removeClass('active');
            })
            eventHub.on('saveAddSongToCollection', (data = {}) => {
                data.forEach((i)=>{
                    this.model.data.songCollection.songs.push(i);
                });
                this.view.render(this.model.data);
            })
            eventHub.on('sendBackAllSongDataToCollection', (allData) => {

                this.filterFromAllSongData(allData, this.model.data.songIds)
            })
        },
        
        filterFromAllSongData(allSongData, ids) {
            let songs = [];
            ids.map((id)=>{
                for (let i = 0; i < allSongData.length; i++) {
                    if (allSongData[i].id === id) {
                        songs.push(allSongData[i]);
                        break
                    }
                }
            });

            this.model.data.songCollection.songs = songs;
            this.view.render(this.model.data);
        },

        updateCover(link){
            this.model.updateCover(link)
                .then(()=>{
    
                    this.view.render(this.model.data)
                    $(this.view.el).addClass('active');
                })
        },
        // createComponent(path) {
        //     let script = document.createElement('script');
        //     script.src = path;
        //     $(document.body).append(script);
        // },

        initQiniu() {
            var uploader = Qiniu.uploader({
                runtimes: 'html5',    //上传模式,依次退化
                browse_button: $(this.view.el).find('#uploadBtn').get(0),       //上传选择的点选按钮，**必需**
                uptoken_url: 'http://localhost:8888/uptoken',
                domain: 'pb70zi5vh.bkt.gdipper.com',   //bucket 域名，下载资源时用到，**必需**
                get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
                max_file_size: '2mb',           //最大文件体积限制
                dragdrop: false,                   //开启可拖曳上传
                // drop_element: this.view.find('#upload'),        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
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


                        eventHub.emit('uploadCollectionCover',sourceLink)
                        
                    },
                    'Error': function (up, err, errTip) {
                        //上传出错时,处理相关的事情
                        alert(err);
                    },
                    'UploadComplete': function () {
                        //队列文件处理完毕后,处理相关的事情
                    },
                }
            });
        },
    };

    controller.init(view, model);
}
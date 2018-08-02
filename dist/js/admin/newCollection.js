var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

{
    let view = {
        el: '#newCollection',
        template: `
           <form>
                <h2>Create A New Song Collection</h2>
                <div class='row'>
                    <label>Collection Name</label>
                    <input name='collectionName'></input>
                </div>
                <div class='row'>
                    <label>Collection Cover</label>
                    <input name='collectionCover'></input>
                </div>
                <div class="btn-wrap">
                    <button type='submit' class='submit'>Submit</button>
                    <button class='cancel'>Cancel</button>
                </div>
           </form>
        `,
        render() {
            $(this.el).html(this.template);
        }
    };

    let model = {
        data: {
            name: '',
            cover: '',
            id: ''
        },

        create(data) {

            var SongCollection = AV.Object.extend('SongCollection');
            // 新建对象
            var songCollection = new SongCollection();
            return songCollection.save({
                name: data.collectionName, cover: data.collectionCover, played: 0
            }).then(data => {
                Object.assign(this.data, _extends({ id: data.id }, data.attributes));
            });
        }
    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render();
            this.bindEvent();
            this.bindEventHub();
        },

        bindEvent() {
            $(this.view.el).on('click', ".cancel", e => {
                e.preventDefault();
                eventHub.emit('cancelCreateNewCollection');
                $(this.view.el).addClass('active');
            });

            $(this.view.el).on('submit', 'form', e => {
                e.preventDefault();
                let form = $(this.view.el).find('form').get(0);
                let items = ['collectionName', 'collectionCover'];
                let data = {};
                items.reduce((prev, i) => {
                    prev[i] = form[i].value;
                    return prev;
                }, data);

                if (data.collectionName !== '') {
                    this.model.create(data).then(() => {
                        let data = JSON.parse(JSON.stringify(this.model.data));
                        eventHub.emit('createSongCollectionFinished', data);
                    });
                } else {
                    $(this.view.el).find("[name='collectionName']").addClass('needInput').get(0).focus();
                }
            });
        },

        bindEventHub() {
            eventHub.on('createNewCollection', () => {
                $(this.view.el).removeClass('active');
            });

            eventHub.on('createSongCollectionFinished', () => {
                $(this.view.el).addClass('active');
            });

            eventHub.on('selectCollection', () => {
                $(this.view.el).addClass('active');
            });
        }
    };

    controller.init(view, model);
}
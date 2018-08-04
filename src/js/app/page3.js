{
    let view = {
        el: '#page3',
        template:  `
            <section class='search'>
                <form>
                    <div class='input-wrap'>
                        <input placeholder='search the song name' class="song-search">
                    </div>
                </form>
            </section>

            <section class='result'>
                <div class='search-confirm'>
                    Search <span class='word-typed-in'></span>
                </div>
                <div class='result-list'>
                    <ul>

                    </ul>
                </div>
            </section>
        `,
        render(data) {
            if (data !== undefined) {
                if(data.searchedSong !== {}) {
                    console.log(data.searchedSong)
                    let a = $('<a></a>').attr('href', `./song.html?id=${data.searchedSong.id}`).text(data.searchedSong.name);
                    let lis = $('<li></li>').append(a);

                    $(this.el).find('.result-list > ul').append(lis);
                }else {
                    return
                }
                
            }else {
                console.log(1)
                $(this.el).html(this.template);
            }
        }
    };

    let model = {
        data: {
            allSongData: []
        },

        matchSong(data){
            this.data.allSongData.map((i)=>{
                if(i.name === data) {
                    this.data.searchedSong = i;
                }
            })
        }
    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render();
            this.bindEvents();
            this.eventHub();
        },

        bindEvents() {
            $(this.view.el).on('input', '.song-search', (e)=>{
                let value = $(e.target).get(0).value;
                $(this.view.el).find('.word-typed-in').text(value);
            });

            $(this.view.el).on('submit', 'form', (e) => {
                e.preventDefault();
                let value = $('.song-search').get(0).value;
                this.model.matchSong(value);
                this.view.render(this.model.data);
            });


        },

        eventHub() {
            eventHub.on('switchPage', (page) => {
                pageID = $(this.view.el)[0].id;
                if (page === pageID) {
                    // $('#inDev').addClass('active').siblings().removeClass('active');
                    $(this.view.el).addClass('active').siblings().removeClass('active');
                }
            });

            eventHub.on('allSongLoaded', (data)=>{
                this.model.data.allSongData = data;
            })
        }
    };

    controller.init(view, model);
}
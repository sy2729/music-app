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
                    lisDom = [];
                    data.searchedSong.map((i)=>{
                        let a = $('<a></a>').attr('href', `./song.html?id=${i.id}`).text(i.name);
                        let lis = $('<li></li>').append(a);
                        lisDom.push(lis);
                    })

                    $(this.el).find('.result-list > ul').empty().append(lisDom);
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
            allSongData: [],
            searchedSong: [],
        },

        matchSong(data){
            this.data.allSongData.map((i)=>{
                if (i.name.toLowerCase().indexOf(data.toLowerCase()) !== -1) {
                    this.data.searchedSong.push(i);
                }
            })
        },

        clearSearchedSong(){
            this.data.searchedSong = [];
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
                this.model.clearSearchedSong();
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
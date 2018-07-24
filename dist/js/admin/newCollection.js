{
    let view = {
        el: '#newCollection',
        template: `
           <form>
                <h2>Create A New Song Collection</h2>
                <div class='row'>
                    <label>Collection Name</label>
                    <input name='collection-name'></input>
                </div>
                <div class='row'>
                    <label>Collection Cover</label>
                    <input name='collection-cover'></input>
                </div>
                <div class="btn-wrap">
                    <button type='submit' class='submit'>Submit</button>
                    <button class='cancel'>Cancel</button>
                </div>
           </form>
        `,
        render(){
            $(this.el).html(this.template);
        }
    };

    let model ={
        collection: {

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

        bindEvent(){
            $(this.view.el).on('click', ".cancel", (e)=>{
                e.preventDefault();
                eventHub.emit('cancelCreateNewCollection');
                $(this.view.el).addClass('active');    
            })
        },

        bindEventHub(){
            eventHub.on('createNewCollection',()=>{
                $(this.view.el).removeClass('active');
            })
        }
    };

    controller.init(view, model);
}
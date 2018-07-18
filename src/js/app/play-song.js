 {
     let view = {
        el: '',
        template: '',
        render() {

        }
     };

     let model = {
        data: {},


        
     };

     let controller = {
         init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render();
            let id = this.getSongData();
            console.log(id)
            this.bindEvents();
         },

         bindEvents(){
            
         },


         getSongData() {
             let query = window.location.search;
             if (query.indexOf('?') === 0) {
                 query = query.substring(1)
             }
             let queryArray = query.split('&').filter(v => v);
             let id = '';
             queryArray.map((i) => {
                 let kv = i.split('=');
                 let key = kv[0];
                 let value = kv[1];
                 if (key === 'id') {
                     id = value;
                     return
                 };

             })

             return id;
         }
     }

     controller.init(view, model);
 }
let obj;
export default (obj = {
    clear: function() {
        console.log('clear');
    },
    start: function() {
        let _this = this;
        setTimeout(function() {
            _this.clear();
        });
    }
}, ()=>obj.start());

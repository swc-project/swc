export default (function() {
    const obj = {
        clear: function() {
            console.log('clear');
        },
        start: function() {
            const _this = this;
            setTimeout(function() {
                _this.clear();
            });
        }
    };
    return ()=>obj.start();
})();

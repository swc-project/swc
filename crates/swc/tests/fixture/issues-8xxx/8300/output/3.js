class Foo extends Bar {
    constructor(){
        var _this = this, _loop = function(i) {
            setTimeout(()=>{
                _this.i = i;
            });
        };
        for (var i of [
            1
        ])_loop(i);
        super();
    }
}

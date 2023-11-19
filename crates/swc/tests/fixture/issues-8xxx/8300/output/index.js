class Foo extends Bar {
    constructor(){
        super();
        var _this = this, _loop = function(i) {
            test(()=>{
                _this.i = i;
            });
        };
        for (var i of [
            1
        ])_loop(i);
    }
}
function test(f) {
    f();
}

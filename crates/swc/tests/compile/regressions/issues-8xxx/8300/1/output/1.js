class Foo extends Bar {
    constructor(){
        var _this, _loop = function(i) {
            test(()=>{
                _this.i = i;
            });
        };
        super();
        for (var i of [
            1
        ])_this = this, _loop(i);
    }
}
function test(f) {
    f();
}

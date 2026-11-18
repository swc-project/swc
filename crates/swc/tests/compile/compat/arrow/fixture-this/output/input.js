function b() {
    var _this = this;
    var t = function(x) {
        return _this.x + x;
    };
}
class Foo extends function() {} {
    constructor(){
        var _this;
        var foo = function() {
            return _this;
        };
        if (true) {
            console.log((super(), _this = this), foo());
        } else {
            super(), _this = this;
            console.log(foo());
        }
    }
}

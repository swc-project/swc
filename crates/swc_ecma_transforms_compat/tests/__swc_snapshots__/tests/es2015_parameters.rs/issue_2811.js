class Foo extends function() {} {
    constructor(){
        var _this;
        var foo = function() {
            for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++){
                rest[_key] = arguments[_key];
            }
            return [
                rest,
                _this
            ];
        };
        if (true) {
            console.log((super(), _this = this), foo());
        } else {
            super(), _this = this;
            console.log(foo());
        }
    }
}

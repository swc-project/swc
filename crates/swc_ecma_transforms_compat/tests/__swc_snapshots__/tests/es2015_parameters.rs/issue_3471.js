var _this = this;
class A {
    a = 1 + function() {
        for(var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++){
            a[_key] = arguments[_key];
        }
        return a;
    };
    b = (()=>{
        var _this = this;
        return function() {
            for(var _len = arguments.length, b = new Array(_len), _key = 0; _key < _len; _key++){
                b[_key] = arguments[_key];
            }
            return b + _this;
        };
    })();
    static c = function() {
        let c = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 123;
        return c + _this;
    };
}

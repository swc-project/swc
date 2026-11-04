var _define_enumerable_properties = require("@swc/helpers/_/_define_enumerable_properties");
var o1 = {
    x: "a",
    foo: function foo() {
        var _this = this;
        var _obj, _mutatorMap = {};
        var o2 = (_obj = {}, _mutatorMap[function() {
            return _this.x;
        }()] = _mutatorMap[function() {
            return _this.x;
        }()] || {}, _mutatorMap[function() {
            return _this.x;
        }()].get = function() {
            return 1;
        }, _define_enumerable_properties._(_obj, _mutatorMap), _obj);
        console.log(o2.a === 1);
    }
};
o1.foo();

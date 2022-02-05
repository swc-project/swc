function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @target: es2015
var array = [];
for(var i = 0; i < 10; ++i){
    array.push(function() {
        var method = function method() {};
        var accessor = function accessor() {
            return 42;
        };
        var accessor = function accessor(val) {};
        var _method = new WeakSet(), _accessor = new WeakSet(), _accessor = new WeakSet();
        var C = function C() {
            "use strict";
            _classCallCheck(this, C);
            _myField.set(this, {
                writable: true,
                value: "hello"
            });
            _method.add(this);
            _accessor.add(this);
            _accessor.add(this);
        };
        var _myField = new WeakMap();
        return C;
    }());
}

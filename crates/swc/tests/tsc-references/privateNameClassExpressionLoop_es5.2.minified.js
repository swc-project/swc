import * as swcHelpers from "@swc/helpers";
for(var array = [], i = 0; i < 10; ++i){
    var _myField, _method, _accessor, get_accessor = function() {
        return 42;
    }, set_accessor = function(val) {};
    array.push((_myField = new WeakMap(), _method = new WeakSet(), _accessor = new WeakMap(), function C() {
        swcHelpers.classCallCheck(this, C), swcHelpers.classPrivateMethodInit(this, _method), swcHelpers.classPrivateFieldInit(this, _accessor, {
            get: get_accessor,
            set: set_accessor
        }), swcHelpers.classPrivateFieldInit(this, _myField, {
            writable: !0,
            value: "hello"
        });
    }));
}

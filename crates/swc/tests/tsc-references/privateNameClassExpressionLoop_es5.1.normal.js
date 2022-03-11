import * as swcHelpers from "@swc/helpers";
// @target: es2015
var array = [];
for(var i = 0; i < 10; ++i){
    var method = function method() {};
    var get_accessor = function get_accessor() {
        return 42;
    };
    var set_accessor = function set_accessor(val) {};
    var _myField, _method, _accessor, _C;
    array.push((_myField = /*#__PURE__*/ new WeakMap(), _method = /*#__PURE__*/ new WeakSet(), _accessor = /*#__PURE__*/ new WeakMap(), _C = function C() {
        "use strict";
        swcHelpers.classCallCheck(this, C);
        swcHelpers.classPrivateMethodInit(this, _method);
        swcHelpers.classPrivateFieldInit(this, _accessor, {
            get: get_accessor,
            set: set_accessor
        });
        swcHelpers.classPrivateFieldInit(this, _myField, {
            writable: true,
            value: "hello"
        });
    }, _C));
}

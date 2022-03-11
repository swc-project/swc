import * as swcHelpers from "@swc/helpers";
// @target: es2015
const array = [];
for(let i = 0; i < 10; ++i){
    var _myField, _method, _accessor, _C;
    array.push((_myField = /*#__PURE__*/ new WeakMap(), _method = /*#__PURE__*/ new WeakSet(), _accessor = /*#__PURE__*/ new WeakMap(), _C = class C {
        constructor(){
            swcHelpers.classPrivateMethodInit(this, _method);
            swcHelpers.classPrivateFieldInit(this, _accessor, {
                get: get_accessor,
                set: set_accessor
            });
            swcHelpers.classPrivateFieldInit(this, _myField, {
                writable: true,
                value: "hello"
            });
        }
    }, _C));
    function method() {}
    function get_accessor() {
        return 42;
    }
    function set_accessor(val) {}
}

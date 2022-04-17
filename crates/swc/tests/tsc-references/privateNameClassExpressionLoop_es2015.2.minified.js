import * as swcHelpers from "@swc/helpers";
let array = [];
for(let i = 0; i < 10; ++i){
    var _myField;
    function get_accessor() {
        return 42;
    }
    function set_accessor(val) {}
    array.push((_myField = new WeakMap(), class {
        constructor(){
            swcHelpers.classPrivateMethodInit(this, new WeakSet()), swcHelpers.classPrivateFieldInit(this, new WeakMap(), {
                get: get_accessor,
                set: set_accessor
            }), swcHelpers.classPrivateFieldInit(this, _myField, {
                writable: !0,
                value: "hello"
            });
        }
    }));
}

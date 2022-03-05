import * as swcHelpers from "@swc/helpers";
const array = [];
for(let i = 0; i < 10; ++i){
    var _myField;
    function set_accessor(val) {}
    array.push((_myField = new WeakMap(), class {
        constructor(){
            swcHelpers.classPrivateMethodInit(this, new WeakSet()), swcHelpers.classPrivateFieldInit(this, new WeakMap(), {
                get: function() {
                    return 42;
                },
                set: set_accessor
            }), swcHelpers.classPrivateFieldInit(this, _myField, {
                writable: !0,
                value: "hello"
            });
        }
    }));
}

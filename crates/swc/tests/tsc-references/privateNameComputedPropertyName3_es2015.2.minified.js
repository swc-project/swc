import * as swcHelpers from "@swc/helpers";
var _name = new WeakMap();
console.log(new class {
    getValue(x) {
        var _y = new WeakMap();
        let tmp = swcHelpers.classPrivateFieldGet(this, _name);
        return new class {
            [tmp]() {
                return x + swcHelpers.classPrivateFieldGet(this, _y);
            }
            constructor(){
                swcHelpers.classPrivateFieldInit(this, _y, {
                    writable: !0,
                    value: 100
                });
            }
        }()[swcHelpers.classPrivateFieldGet(this, _name)]();
    }
    constructor(name){
        swcHelpers.classPrivateFieldInit(this, _name, {
            writable: !0,
            value: void 0
        }), swcHelpers.classPrivateFieldSet(this, _name, name);
    }
}("NAME").getValue(100));

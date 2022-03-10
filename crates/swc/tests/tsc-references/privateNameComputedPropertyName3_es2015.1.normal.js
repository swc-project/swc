import * as swcHelpers from "@swc/helpers";
var _name = /*#__PURE__*/ new WeakMap();
// @target: esnext, es2022, es2015
class Foo {
    getValue(x) {
        const obj = this;
        var _y = /*#__PURE__*/ new WeakMap();
        let tmp = swcHelpers.classPrivateFieldGet(obj, _name);
        class Bar {
            [tmp]() {
                return x + swcHelpers.classPrivateFieldGet(this, _y);
            }
            constructor(){
                swcHelpers.classPrivateFieldInit(this, _y, {
                    writable: true,
                    value: 100
                });
            }
        }
        return new Bar()[swcHelpers.classPrivateFieldGet(obj, _name)]();
    }
    constructor(name){
        swcHelpers.classPrivateFieldInit(this, _name, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldSet(this, _name, name);
    }
}
console.log(new Foo("NAME").getValue(100));

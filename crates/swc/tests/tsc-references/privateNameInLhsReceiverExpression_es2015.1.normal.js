import * as swcHelpers from "@swc/helpers";
var _y = /*#__PURE__*/ new WeakMap();
// @target: es2015
class Test {
    static something(obj) {
        var _s;
        var _x, _x1;
        swcHelpers.classPrivateFieldSet(obj[(new (_x = /*#__PURE__*/ new WeakMap(), class {
            constructor(){
                swcHelpers.classPrivateFieldInit(this, _x, {
                    writable: true,
                    value: 1
                });
                this.s = "prop";
            }
        })).s], _y, 1);
        swcHelpers.classPrivateFieldSet(_s = obj[(new (_x1 = /*#__PURE__*/ new WeakMap(), class {
            constructor(){
                swcHelpers.classPrivateFieldInit(this, _x1, {
                    writable: true,
                    value: 1
                });
                this.s = "prop";
            }
        })).s], _y, swcHelpers.classPrivateFieldGet(_s, _y) + 1);
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _y, {
            writable: true,
            value: 123
        });
    }
}

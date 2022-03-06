import * as swcHelpers from "@swc/helpers";
var _x, _class;
// @target: es2015
const C = (_x = new WeakMap(), _class = class {
    m() {
        swcHelpers.classPrivateFieldSet(this, _x, swcHelpers.classPrivateFieldGet(this, _x) + 2); // Error
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _x, {
            get: void 0,
            set: set_x
        });
    }
}, _class);
console.log(new C().m());
function set_x(x) {}

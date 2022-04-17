var _x;
import * as swcHelpers from "@swc/helpers";
let C = (_x = new WeakMap(), class {
    m() {
        swcHelpers.classPrivateFieldSet(this, _x, swcHelpers.classPrivateFieldGet(this, _x) + 2);
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _x, {
            get: void 0,
            set: function(x) {}
        });
    }
});
console.log(new C().m());

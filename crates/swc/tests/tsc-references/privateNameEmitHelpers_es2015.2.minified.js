import * as swcHelpers from "@swc/helpers";
var _a = new WeakMap(), _b = new WeakSet(), _c = new WeakMap();
export class C {
    constructor(){
        swcHelpers.classPrivateMethodInit(this, _b), swcHelpers.classPrivateFieldInit(this, _c, {
            get: void 0,
            set: function(v) {
                swcHelpers.classPrivateFieldSet(this, _a, swcHelpers.classPrivateFieldGet(this, _a) + v);
            }
        }), swcHelpers.classPrivateFieldInit(this, _a, {
            writable: !0,
            value: 1
        });
    }
}

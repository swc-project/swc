import * as swcHelpers from "@swc/helpers";
var _prop = new WeakMap();
class C {
    method(other) {
        const obj = swcHelpers.objectSpread({}, other);
        swcHelpers.classPrivateFieldGet(obj, _prop);
        const rest = swcHelpers.extends({}, other);
        swcHelpers.classPrivateFieldGet(rest, _prop);
        const statics = swcHelpers.objectSpread({}, C);
        swcHelpers.classStaticPrivateFieldSpecGet(statics, C, _propStatic);
        const sRest = swcHelpers.extends({}, C);
        swcHelpers.classStaticPrivateFieldSpecGet(sRest, C, _propStatic);
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _prop, {
            writable: !0,
            value: 1
        });
    }
}
var _propStatic = {
    writable: !0,
    value: 1
};

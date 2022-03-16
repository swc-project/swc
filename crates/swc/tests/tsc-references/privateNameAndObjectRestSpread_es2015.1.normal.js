import * as swcHelpers from "@swc/helpers";
var _prop = /*#__PURE__*/ new WeakMap();
// @strict: true
// @target: es6
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
            writable: true,
            value: 1
        });
    }
}
var _propStatic = {
    writable: true,
    value: 1
};

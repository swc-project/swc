import * as swcHelpers from "@swc/helpers";
var _obj, o = {
    a: 1,
    b: 'no'
}, PrivateOptionalX = function() {
    "use strict";
    swcHelpers.classCallCheck(this, PrivateOptionalX);
}, PublicX = function() {
    "use strict";
    swcHelpers.classCallCheck(this, PublicX);
}, o2 = swcHelpers.objectSpread({}, publicX, privateOptionalX);
o2.x, swcHelpers.objectSpread({}, optionalString, optionalNumber), swcHelpers.objectSpread({}, {
    b: !0
}, {
    s: "foo"
}), swcHelpers.objectSpread({
    b: 'bad'
}, o, {
    b: 'bad'
}, o2, {
    b: 'bad'
}), swcHelpers.objectSpread({}, o, o), swcHelpers.objectSpread({
    b: 'ignored'
}, o);
var o3 = {
    a: 1,
    b: 'no'
}, o4 = {
    b: 'yes',
    c: !0
};
swcHelpers.objectSpread({
    b: 'ok'
}, o3, o4), swcHelpers.objectSpread({}, o3, {
    b: 'ok'
}, o4), swcHelpers.objectSpread({}, swcHelpers.objectSpread({
    a: 4
}, {
    b: !1,
    c: 'overriden'
}), {
    d: 'actually new'
}, {
    a: 5,
    d: 'maybe new'
}), swcHelpers.objectSpread({
    a: 'wrong type?'
}, o3), swcHelpers.objectSpread({}, o3, (_obj = {}, swcHelpers.defineProperty(_obj, 'in the middle', 13), swcHelpers.defineProperty(_obj, "b", 'maybe?'), _obj), o4), swcHelpers.objectSpread({}, 12), swcHelpers.objectSpread({}, 2), swcHelpers.objectSpread({}, 0).toFixed(), swcHelpers.objectSpread({}, !0).valueOf();
var spreadStr = swcHelpers.objectSpread({}, 'foo');
spreadStr.length, spreadStr.charAt(1), swcHelpers.objectSpread({}, function() {})(), swcHelpers.objectSpread({}, {
    set b (bad){}
}).b = 12;
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C), this.p = 1;
    }
    return C.prototype.m = function() {}, C;
}(), c = new C();
swcHelpers.objectSpread({}, c).m(), swcHelpers.objectSpread({}, {
    a: 123
}).a;

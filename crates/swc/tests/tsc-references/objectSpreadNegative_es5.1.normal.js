import * as swcHelpers from "@swc/helpers";
// @target: es5
// @strictNullChecks: true
var o = {
    a: 1,
    b: "no"
};
/// private propagates
var PrivateOptionalX = function PrivateOptionalX() {
    "use strict";
    swcHelpers.classCallCheck(this, PrivateOptionalX);
};
var PublicX = function PublicX() {
    "use strict";
    swcHelpers.classCallCheck(this, PublicX);
};
var o2 = swcHelpers.objectSpread({}, publicX, privateOptionalX);
var sn = o2.x; // error, x is private
var allOptional = swcHelpers.objectSpread({}, optionalString, optionalNumber);
var spread = swcHelpers.objectSpread({}, {
    b: true
}, {
    s: "foo"
});
spread = {
    s: "foo"
}; // error, missing 'b'
var b = {
    b: false
};
spread = b; // error, missing 's'
// literal repeats are not allowed, but spread repeats are fine
var duplicated = swcHelpers.objectSpread({
    b: "bad"
}, o, {
    b: "bad"
}, o2, {
    b: "bad"
});
var duplicatedSpread = swcHelpers.objectSpread({}, o, o);
// Note: ignore changes the order that properties are printed
var ignore = swcHelpers.objectSpread({
    b: "ignored"
}, o);
var o3 = {
    a: 1,
    b: "no"
};
var o4 = {
    b: "yes",
    c: true
};
var combinedBefore = swcHelpers.objectSpread({
    b: "ok"
}, o3, o4);
var combinedMid = swcHelpers.objectSpread({}, o3, {
    b: "ok"
}, o4);
var combinedNested = swcHelpers.objectSpread({}, swcHelpers.objectSpread({
    a: 4
}, {
    b: false,
    c: "overriden"
}), {
    d: "actually new"
}, {
    a: 5,
    d: "maybe new"
});
var changeTypeBefore = swcHelpers.objectSpread({
    a: "wrong type?"
}, o3);
var _obj;
var computedMiddle = swcHelpers.objectSpread({}, o3, (_obj = {}, swcHelpers.defineProperty(_obj, "in the middle", 13), swcHelpers.defineProperty(_obj, "b", "maybe?"), _obj), o4);
// primitives are not allowed, except for falsy ones
var spreadNum = swcHelpers.objectSpread({}, 12);
var spreadSum = swcHelpers.objectSpread({}, 1 + 1);
var spreadZero = swcHelpers.objectSpread({}, 0);
spreadZero.toFixed(); // error, no methods even from a falsy number
var spreadBool = swcHelpers.objectSpread({}, true);
spreadBool.valueOf();
var spreadStr = swcHelpers.objectSpread({}, "foo");
spreadStr.length; // error, no 'length'
spreadStr.charAt(1); // error, no methods either
// functions are skipped
var spreadFunc = swcHelpers.objectSpread({}, function() {});
spreadFunc(); // error, no call signature
// write-only properties get skipped
var setterOnly = swcHelpers.objectSpread({}, {
    set b (bad){}
});
setterOnly.b = 12; // error, 'b' does not exist
// methods are skipped because they aren't enumerable
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
        this.p = 1;
    }
    var _proto = C.prototype;
    _proto.m = function m() {};
    return C;
}();
var c = new C();
var spreadC = swcHelpers.objectSpread({}, c);
spreadC.m(); // error 'm' is not in '{ ... c }'
// non primitive
var obj = {
    a: 123
};
var spreadObj = swcHelpers.objectSpread({}, obj);
spreadObj.a; // error 'a' is not in {}

import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _define_property from "@swc/helpers/lib/_define_property.js";
import _object_spread from "@swc/helpers/lib/_object_spread.js";
// @target: es5
// @strictNullChecks: true
var o = {
    a: 1,
    b: "no"
};
/// private propagates
var PrivateOptionalX = function PrivateOptionalX() {
    "use strict";
    _class_call_check(this, PrivateOptionalX);
};
var PublicX = function PublicX() {
    "use strict";
    _class_call_check(this, PublicX);
};
var o2 = _object_spread({}, publicX, privateOptionalX);
var sn = o2.x; // error, x is private
var allOptional = _object_spread({}, optionalString, optionalNumber);
var spread = _object_spread({}, {
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
var duplicated = _object_spread({
    b: "bad"
}, o, {
    b: "bad"
}, o2, {
    b: "bad"
});
var duplicatedSpread = _object_spread({}, o, o);
// Note: ignore changes the order that properties are printed
var ignore = _object_spread({
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
var combinedBefore = _object_spread({
    b: "ok"
}, o3, o4);
var combinedMid = _object_spread({}, o3, {
    b: "ok"
}, o4);
var combinedNested = _object_spread({}, _object_spread({
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
var changeTypeBefore = _object_spread({
    a: "wrong type?"
}, o3);
var _obj;
var computedMiddle = _object_spread({}, o3, (_obj = {}, _define_property(_obj, "in the middle", 13), _define_property(_obj, "b", "maybe?"), _obj), o4);
// primitives are not allowed, except for falsy ones
var spreadNum = _object_spread({}, 12);
var spreadSum = _object_spread({}, 1 + 1);
var spreadZero = _object_spread({}, 0);
spreadZero.toFixed(); // error, no methods even from a falsy number
var spreadBool = _object_spread({}, true);
spreadBool.valueOf();
var spreadStr = _object_spread({}, "foo");
spreadStr.length; // error, no 'length'
spreadStr.charAt(1); // error, no methods either
// functions are skipped
var spreadFunc = _object_spread({}, function() {});
spreadFunc(); // error, no call signature
// write-only properties get skipped
var setterOnly = _object_spread({}, {
    set b (bad){}
});
setterOnly.b = 12; // error, 'b' does not exist
// methods are skipped because they aren't enumerable
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
        this.p = 1;
    }
    var _proto = C.prototype;
    _proto.m = function m() {};
    return C;
}();
var c = new C();
var spreadC = _object_spread({}, c);
spreadC.m(); // error 'm' is not in '{ ... c }'
// non primitive
var obj = {
    a: 123
};
var spreadObj = _object_spread({}, obj);
spreadObj.a; // error 'a' is not in {}

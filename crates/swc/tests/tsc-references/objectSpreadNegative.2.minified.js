//// [objectSpreadNegative.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
var _obj, o = {
    a: 1,
    b: "no"
}, PrivateOptionalX = function PrivateOptionalX() {
    "use strict";
    _class_call_check(this, PrivateOptionalX);
}, PublicX = function PublicX() {
    "use strict";
    _class_call_check(this, PublicX);
}, o2 = _object_spread({}, publicX, privateOptionalX), sn = o2.x, allOptional = _object_spread({}, optionalString, optionalNumber), spread = _object_spread({}, {
    b: !0
}, {
    s: "foo"
});
spread = {
    s: "foo"
};
var b = {
    b: !1
};
spread = b;
var duplicated = _object_spread_props(_object_spread(_object_spread_props(_object_spread({
    b: "bad"
}, o), {
    b: "bad"
}), o2), {
    b: "bad"
}), duplicatedSpread = _object_spread({}, o, o), ignore = _object_spread({
    b: "ignored"
}, o), o3 = {
    a: 1,
    b: "no"
}, o4 = {
    b: "yes",
    c: !0
}, combinedBefore = _object_spread({
    b: "ok"
}, o3, o4), combinedMid = _object_spread(_object_spread_props(_object_spread({}, o3), {
    b: "ok"
}), o4), combinedNested = _object_spread(_object_spread_props(_object_spread({}, _object_spread({
    a: 4
}, {
    b: !1,
    c: "overriden"
})), {
    d: "actually new"
}), {
    a: 5,
    d: "maybe new"
}), changeTypeBefore = _object_spread({
    a: "wrong type?"
}, o3), computedMiddle = _object_spread(_object_spread_props(_object_spread({}, o3), (_define_property(_obj = {}, "in the middle", 13), _define_property(_obj, "b", "maybe?"), _obj)), o4), spreadNum = _object_spread({}, 12), spreadSum = _object_spread({}, 2), spreadZero = _object_spread({}, 0);
spreadZero.toFixed();
var spreadBool = _object_spread({}, !0);
spreadBool.valueOf();
var spreadStr = _object_spread({}, "foo");
spreadStr.length, spreadStr.charAt(1);
var spreadFunc = _object_spread({}, function() {});
spreadFunc();
var setterOnly = _object_spread({}, {
    set b (bad){}
});
setterOnly.b = 12;
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C), this.p = 1;
    }
    return C.prototype.m = function() {}, C;
}(), c = new C(), spreadC = _object_spread({}, c);
spreadC.m();
var obj = {
    a: 123
}, spreadObj = _object_spread({}, obj);
spreadObj.a;

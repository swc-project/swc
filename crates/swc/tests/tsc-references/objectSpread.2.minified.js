//// [objectSpread.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import "@swc/helpers/src/_define_property.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
var anything, o = {
    a: 1,
    b: "no"
}, o2 = {
    b: "yes",
    c: !0
};
_object_spread_props(_extends({}, o), {
    c: !1
}), _extends({
    c: !1
}, o), _object_spread_props(_extends({}, o), {
    b: "override"
}), _object_spread_props(_extends({}, _extends({
    a: 3
}, {
    b: !1,
    c: "overriden"
})), {
    c: "whatever"
}), _extends({}, o, o2), _object_spread_props(_extends({}, o, o2), {
    b: "ok"
}), _object_spread_props(_extends({}, _extends({
    a: 1
}, {
    b: !1,
    c: "overriden"
})), {
    c: -1
}), _extends({}, o), _object_spread_props(_extends({}, {
    get a () {
        return 6;
    }
}), {
    c: 7
}).a = 12, _extends({}, function() {}), _extends({}, anything);
var c = new (function() {
    "use strict";
    function C() {
        _class_call_check(this, C), this.p = 1;
    }
    return C.prototype.m = function() {}, C;
}())();
function f(t, u) {
    return _object_spread_props(_extends({}, t, u), {
        id: "id"
    });
}
_extends({}, c), _object_spread_props(_extends({}, c), {
    plus: function() {
        return this.p + 1;
    }
}).plus(), _object_spread_props(_extends({}, o), {
    a: "wrong type?"
}), _extends({}, o, {
    a: "yes",
    b: -1
}), _object_spread_props(_extends({}, o), {
    a: 12
}), _extends({}, {}), f({
    a: 1,
    b: "yes"
}, {
    c: "no",
    d: !1
}), f({
    a: 1
}, {
    a: 2,
    b: "extra"
}), f({
    a: 1
}, {
    a: "mismatch"
}), f({
    a: 1,
    id: !0
}, {
    c: 1,
    d: "no"
});

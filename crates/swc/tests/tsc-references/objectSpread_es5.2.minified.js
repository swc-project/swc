import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _define_property from "@swc/helpers/lib/_define_property.js";
import _object_spread from "@swc/helpers/lib/_object_spread.js";
import _object_spread_props from "@swc/helpers/lib/_object_spread_props.js";
var anything, o = {
    a: 1,
    b: "no"
}, o2 = {
    b: "yes",
    c: !0
};
_object_spread_props(_object_spread({}, o), {
    c: !1
}), _object_spread({
    c: !1
}, o), _object_spread_props(_object_spread({}, o), {
    b: "override"
}), _object_spread_props(_object_spread({}, _object_spread({
    a: 3
}, {
    b: !1,
    c: "overriden"
})), {
    c: "whatever"
}), _object_spread({}, o, o2), _object_spread_props(_object_spread({}, o, o2), {
    b: "ok"
}), _object_spread_props(_object_spread({}, _object_spread({
    a: 1
}, {
    b: !1,
    c: "overriden"
})), {
    c: -1
}), _object_spread({}, o), _object_spread_props(_object_spread({}, {
    get a () {
        return 6;
    }
}), {
    c: 7
}).a = 12, _object_spread({}, function() {}), _object_spread({}, anything);
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C), this.p = 1;
    }
    return C.prototype.m = function() {}, C;
}(), c = new C();
function f(t, u) {
    return _object_spread_props(_object_spread({}, t, u), {
        id: "id"
    });
}
_object_spread({}, c), _object_spread_props(_object_spread({}, c), {
    plus: function() {
        return this.p + 1;
    }
}).plus(), _object_spread_props(_object_spread({}, o), {
    a: "wrong type?"
}), _object_spread({}, o, {
    a: "yes",
    b: -1
}), _object_spread_props(_object_spread({}, o), {
    a: 12
}), _object_spread({}, {}), f({
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

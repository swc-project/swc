//// [objectSpread.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
var anything, o = {
    a: 1,
    b: "no"
}, o2 = {
    b: "yes",
    c: !0
}, swap = {
    a: "yes",
    b: -1
}, addAfter = _object_spread_props(_object_spread({}, o), {
    c: !1
}), addBefore = _object_spread({
    c: !1
}, o), override = _object_spread_props(_object_spread({}, o), {
    b: "override"
}), nested = _object_spread_props(_object_spread({}, _object_spread({
    a: 3
}, {
    b: !1,
    c: "overriden"
})), {
    c: "whatever"
}), combined = _object_spread({}, o, o2), combinedAfter = _object_spread_props(_object_spread({}, o, o2), {
    b: "ok"
}), combinedNestedChangeType = _object_spread_props(_object_spread({}, _object_spread({
    a: 1
}, {
    b: !1,
    c: "overriden"
})), {
    c: -1
}), propertyNested = {
    a: _object_spread({}, o)
}, op = {
    get a () {
        return 6;
    }
}, getter = _object_spread_props(_object_spread({}, op), {
    c: 7
});
getter.a = 12;
var spreadFunc = _object_spread({}, function() {});
function from16326(header, authToken) {
    return _object_spread({}, this.header, header, authToken && {
        authToken: authToken
    });
}
function conditionalSpreadBoolean(b) {
    var o = {
        x: 12,
        y: 13
    };
    return o = _object_spread({}, o, b && {
        x: 14
    }), _object_spread({}, b && {
        x: 21
    }), o;
}
function conditionalSpreadNumber(nt) {
    var o = {
        x: 15,
        y: 16
    };
    return o = _object_spread({}, o, nt && {
        x: nt
    }), _object_spread({}, nt && {
        x: nt
    }), o;
}
function conditionalSpreadString(st) {
    var o = {
        x: "hi",
        y: 17
    };
    return o = _object_spread({}, o, st && {
        x: st
    }), _object_spread({}, st && {
        x: st
    }), o;
}
var spreadAny = _object_spread({}, anything), C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C), this.p = 1;
    }
    return C.prototype.m = function() {}, C;
}(), c = new C(), spreadC = _object_spread({}, c), cplus = _object_spread_props(_object_spread({}, c), {
    plus: function() {
        return this.p + 1;
    }
});
cplus.plus();
var changeTypeAfter = _object_spread_props(_object_spread({}, o), {
    a: "wrong type?"
}), changeTypeBoth = _object_spread({}, o, swap);
function container(definiteBoolean, definiteString, optionalString, optionalNumber) {
    _object_spread({}, definiteBoolean, definiteString, optionalNumber), _object_spread({}, definiteBoolean, definiteString, optionalString, optionalNumber), _object_spread({}, optionalString, optionalNumber), _object_spread_props(_object_spread(_define_property({}, "before everything", 12), o), {
        b: "yes"
    }), _object_spread_props(_object_spread({}, o), _define_property({
        b: "yeah"
    }, "at the end", 14));
}
var a = 12, shortCutted = _object_spread_props(_object_spread({}, o), {
    a: a
}), spreadNonPrimitive = _object_spread({}, {});
function f(t, u) {
    return _object_spread_props(_object_spread({}, t, u), {
        id: "id"
    });
}
var exclusive = f({
    a: 1,
    b: "yes"
}, {
    c: "no",
    d: !1
}), overlap = f({
    a: 1
}, {
    a: 2,
    b: "extra"
}), overlapConflict = f({
    a: 1
}, {
    a: "mismatch"
}), overwriteId = f({
    a: 1,
    id: !0
}, {
    c: 1,
    d: "no"
});
function genericSpread(t, u, v, w, obj) {
    _object_spread({}, t), _object_spread({}, t, t), _object_spread({}, t, u), _object_spread({}, u, t), _object_spread({
        a: 5,
        b: "hi"
    }, t), _object_spread_props(_object_spread({}, t), {
        a: 5,
        b: "hi"
    }), _object_spread(_object_spread_props(_object_spread({
        a: 5,
        b: "hi"
    }, t), {
        c: !0
    }), obj), _object_spread(_object_spread_props(_object_spread({
        a: 5
    }, t), {
        b: "hi",
        c: !0
    }), obj), _object_spread(_object_spread_props(_object_spread({
        a: 5
    }, t), {
        b: "hi"
    }), u, obj), _object_spread({}, v), _object_spread({}, v, obj), _object_spread({}, w), _object_spread({}, w, obj), _object_spread({}, t, v), _object_spread({}, t, w), _object_spread({}, t, w, obj), _object_spread({}, t, v, w);
}

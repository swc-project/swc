//// [spreadOverwritesPropertyStrict.ts]
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
var unused1 = _extends({
    b: 1
}, ab) // error
;
var unused2 = _extends({}, ab, ab) // ok, overwritten error doesn't apply to spreads
;
var unused3 = _extends({
    b: 1
}, abq) // ok, abq might have b: undefined
;
var unused4 = _object_spread_props(_extends({}, ab), {
    b: 1
}) // ok, we don't care that b in ab is overwritten
;
var unused5 = _object_spread_props(_extends({}, abq), {
    b: 1
}) // ok
;
function g(obj) {
    return _extends({
        x: 1
    }, obj); // ok, obj might have x: undefined
}
function f(obj) {
    return _extends({
        x: 1
    }, obj); // ok, obj might be undefined
}
function h(obj) {
    return _extends({
        x: 1
    }, obj) // error
    ;
}
function i(b, t) {
    return _extends({
        command: "hi"
    }, b ? t : {}) // ok
    ;
}
function j() {
    return _extends({}, {
        command: "hi"
    }, {
        command: "bye"
    }) // ok
    ;
}
function k(t) {
    return _extends(_object_spread_props(_extends({
        command: "hi"
    }, {
        spoiler: true
    }), {
        spoiler2: true
    }), t) // error
    ;
}
function l(anyrequired) {
    return _extends({
        a: "zzz"
    }, anyrequired) // error
    ;
}
function m(anyoptional) {
    return _extends({
        a: "zzz"
    }, anyoptional) // ok
    ;
}

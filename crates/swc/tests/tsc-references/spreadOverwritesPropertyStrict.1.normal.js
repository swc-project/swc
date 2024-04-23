//// [spreadOverwritesPropertyStrict.ts]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
var unused1 = _object_spread({
    b: 1
}, ab) // error
;
var unused2 = _object_spread({}, ab, ab) // ok, overwritten error doesn't apply to spreads
;
var unused3 = _object_spread({
    b: 1
}, abq) // ok, abq might have b: undefined
;
var unused4 = _object_spread_props(_object_spread({}, ab), {
    b: 1
}) // ok, we don't care that b in ab is overwritten
;
var unused5 = _object_spread_props(_object_spread({}, abq), {
    b: 1
}) // ok
;
function g(obj) {
    return _object_spread({
        x: 1
    }, obj); // ok, obj might have x: undefined
}
function f(obj) {
    return _object_spread({
        x: 1
    }, obj); // ok, obj might be undefined
}
function h(obj) {
    return _object_spread({
        x: 1
    }, obj) // error
    ;
}
function i(b, t) {
    return _object_spread({
        command: "hi"
    }, b ? t : {}) // ok
    ;
}
function j() {
    return _object_spread({}, {
        command: "hi"
    }, {
        command: "bye"
    }) // ok
    ;
}
function k(t) {
    return _object_spread(_object_spread_props(_object_spread({
        command: "hi"
    }, {
        spoiler: true
    }), {
        spoiler2: true
    }), t) // error
    ;
}
function l(anyrequired) {
    return _object_spread({
        a: 'zzz'
    }, anyrequired) // error
    ;
}
function m(anyoptional) {
    return _object_spread({
        a: 'zzz'
    }, anyoptional) // ok
    ;
}

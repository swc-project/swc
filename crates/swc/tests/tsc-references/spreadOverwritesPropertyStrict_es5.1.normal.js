import * as swcHelpers from "@swc/helpers";
var unused1 = swcHelpers.objectSpread({
    b: 1
}, ab) // error
;
var unused2 = swcHelpers.objectSpread({}, ab, ab) // ok, overwritten error doesn't apply to spreads
;
var unused3 = swcHelpers.objectSpread({
    b: 1
}, abq) // ok, abq might have b: undefined
;
var unused4 = swcHelpers.objectSpread({}, ab, {
    b: 1
}) // ok, we don't care that b in ab is overwritten
;
var unused5 = swcHelpers.objectSpread({}, abq, {
    b: 1
}) // ok
;
function g(obj) {
    return swcHelpers.objectSpread({
        x: 1
    }, obj); // ok, obj might have x: undefined
}
function f(obj) {
    return swcHelpers.objectSpread({
        x: 1
    }, obj); // ok, obj might be undefined
}
function h(obj) {
    return swcHelpers.objectSpread({
        x: 1
    }, obj) // error
    ;
}
function i(b, t) {
    return swcHelpers.objectSpread({
        command: "hi"
    }, b ? t : {}) // ok
    ;
}
function j() {
    return swcHelpers.objectSpread({}, {
        command: "hi"
    }, {
        command: "bye"
    }) // ok
    ;
}
function k(t) {
    return swcHelpers.objectSpread({
        command: "hi"
    }, {
        spoiler: true
    }, {
        spoiler2: true
    }, t) // error
    ;
}
function l(anyrequired) {
    return swcHelpers.objectSpread({
        a: 'zzz'
    }, anyrequired) // error
    ;
}
function m(anyoptional) {
    return swcHelpers.objectSpread({
        a: 'zzz'
    }, anyoptional) // ok
    ;
}

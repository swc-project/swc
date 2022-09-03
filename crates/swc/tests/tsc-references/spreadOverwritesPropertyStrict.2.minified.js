//// [spreadOverwritesPropertyStrict.ts]
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
var unused1 = _object_spread({
    b: 1
}, ab), unused2 = _object_spread({}, ab, ab), unused3 = _object_spread({
    b: 1
}, abq), unused4 = _object_spread_props(_object_spread({}, ab), {
    b: 1
}), unused5 = _object_spread_props(_object_spread({}, abq), {
    b: 1
});
function g(obj) {
    return _object_spread({
        x: 1
    }, obj);
}
function f(obj) {
    return _object_spread({
        x: 1
    }, obj);
}
function h(obj) {
    return _object_spread({
        x: 1
    }, obj);
}
function i(b, t) {
    return _object_spread({
        command: "hi"
    }, b ? t : {});
}
function j() {
    return _object_spread({}, {
        command: "hi"
    }, {
        command: "bye"
    });
}
function k(t) {
    return _object_spread(_object_spread_props(_object_spread({
        command: "hi"
    }, {
        spoiler: !0
    }), {
        spoiler2: !0
    }), t);
}
function l(anyrequired) {
    return _object_spread({
        a: "zzz"
    }, anyrequired);
}
function m(anyoptional) {
    return _object_spread({
        a: "zzz"
    }, anyoptional);
}

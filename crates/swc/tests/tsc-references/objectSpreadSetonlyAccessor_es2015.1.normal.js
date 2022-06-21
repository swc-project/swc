import _object_spread from "@swc/helpers/src/_object_spread.mjs";
// @strict: true
// @target: esnext
const o1 = _object_spread({
    foo: 1
}, {
    set bar (_v){}
});
const o2 = _object_spread({
    foo: 1
}, {
    set foo (_v){}
});

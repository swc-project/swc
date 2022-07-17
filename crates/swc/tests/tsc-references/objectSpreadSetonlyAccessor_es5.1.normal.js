// @strict: true
// @target: esnext
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
var o1 = _object_spread({
    foo: 1
}, {
    set bar (_v){}
});
var o2 = _object_spread({
    foo: 1
}, {
    set foo (_v){}
});

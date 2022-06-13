import _object_spread from "@swc/helpers/src/_object_spread.mjs";
_object_spread({
    foo: 1
}, {
    set bar (_v){}
}), _object_spread({
    foo: 1
}, {
    set foo (_v){}
});

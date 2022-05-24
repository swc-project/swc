import _object_spread from "@swc/helpers/lib/_object_spread.js";
_object_spread({
    foo: 1
}, {
    set bar (_v){}
}), _object_spread({
    foo: 1
}, {
    set foo (_v){}
});

import _define_property from "@swc/helpers/src/_define_property.mjs";
var _obj;
//@target: ES6
var i = (_obj = {}, _define_property(_obj, Symbol.iterator, {
    p: null
}), _define_property(_obj, Symbol.toStringTag, function() {
    return {
        p: undefined
    };
}), _obj);
var it = i[Symbol.iterator];
var str = i[Symbol.toStringTag]();

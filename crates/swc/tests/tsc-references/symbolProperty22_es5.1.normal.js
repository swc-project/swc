import _define_property from "@swc/helpers/src/_define_property.mjs";
foo("", _define_property({}, Symbol.unscopables, function(s) {
    return s.length;
}));

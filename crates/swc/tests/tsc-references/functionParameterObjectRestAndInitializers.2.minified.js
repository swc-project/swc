//// [functionParameterObjectRestAndInitializers.ts]
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
function f(_param, b = a) {
    var { a  } = _param;
    return _object_without_properties(_param, [
        "a"
    ]), b;
}
function g(_param, b = ({ a  }, b = a)=>{}) {
    var { a  } = _param;
    return _object_without_properties(_param, [
        "a"
    ]), b;
}

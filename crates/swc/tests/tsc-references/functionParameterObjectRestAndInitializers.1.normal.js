//// [functionParameterObjectRestAndInitializers.ts]
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
// https://github.com/microsoft/TypeScript/issues/47079
function f(_param, b = a) {
    var { a } = _param, x = _object_without_properties(_param, [
        "a"
    ]);
    return b;
}
function g(_param, b = ({ a }, b = a)=>{}) {
    var { a } = _param, x = _object_without_properties(_param, [
        "a"
    ]);
    return b;
}

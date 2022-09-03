//// [restElementWithNullInitializer.ts]
import _to_array from "@swc/helpers/src/_to_array.mjs";
function foo1() {
    var ref = _to_array(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null);
    ref.slice(0);
}
function foo2() {
    var ref = _to_array(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0);
    ref.slice(0);
}
function foo3() {
    var ref = _to_array(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {});
    ref.slice(0);
}
function foo4() {
    var ref = _to_array(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : []);
    ref.slice(0);
}

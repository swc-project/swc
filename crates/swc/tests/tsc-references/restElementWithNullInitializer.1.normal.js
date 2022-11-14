//// [restElementWithNullInitializer.ts]
import _to_array from "@swc/helpers/src/_to_array.mjs";
function foo1() {
    var _ref = _to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null), r = _ref.slice(0);
}
function foo2() {
    var _ref = _to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : undefined), r = _ref.slice(0);
}
function foo3() {
    var _ref = _to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}), r = _ref.slice(0);
}
function foo4() {
    var _ref = _to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : []), r = _ref.slice(0);
}

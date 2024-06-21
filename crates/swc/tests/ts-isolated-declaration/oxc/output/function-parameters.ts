// Correct
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
export function fnDeclGood() {
    var p = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], rParam = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
}
export function fnDeclGood2() {
    var p = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], rParam = arguments.length > 1 ? arguments[1] : void 0;
}
export function fooGood() {
    var _ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        1,
        2
    ], 2), a = _ref[0], b = _ref[1];
    return 2;
}
export var fooGood2 = function() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        a: 1,
        b: 2
    }, a = _ref.a, b = _ref.b;
    return 2;
};
// Incorrect
export function fnDeclBad() {
    var p = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], rParam = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r2 = arguments.length > 2 ? arguments[2] : void 0;
}
export function fnDeclBad2() {
    var p = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], r2 = arguments.length > 1 ? arguments[1] : void 0;
}
export function fnDeclBad3() {
    var p = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], rParam = arguments.length > 1 ? arguments[1] : void 0, r2 = arguments.length > 2 ? arguments[2] : void 0;
}
export function fooBad() {
    var _ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        1,
        2
    ], 2), a = _ref[0], b = _ref[1];
    return 2;
}
export var fooBad2 = function() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        a: 1,
        b: 2
    }, a = _ref.a, b = _ref.b;
    return 2;
};

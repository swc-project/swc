import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
function f0(a, b) {
    f0(a, b), f1(a, b), f2(a, b);
}
function f1() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    f0.apply(void 0, _to_consumable_array(args)), f1("abc", "def"), f1.apply(void 0, [
        "abc"
    ].concat(_to_consumable_array(args))), f1.apply(void 0, _to_consumable_array(args));
}
function f2() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    f0.apply(void 0, _to_consumable_array(args)), f1("abc", "def"), f1.apply(void 0, [
        "abc"
    ].concat(_to_consumable_array(args))), f1.apply(void 0, _to_consumable_array(args)), f2("abc", "def"), f2.apply(void 0, [
        "abc"
    ].concat(_to_consumable_array(args))), f2.apply(void 0, _to_consumable_array(args));
}

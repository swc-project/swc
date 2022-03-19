import * as swcHelpers from "@swc/helpers";
function f0(a, b) {
    f0(a, b), f1(a, b), f2(a, b);
}
function f1() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    f0.apply(void 0, swcHelpers.toConsumableArray(args)), f1('abc', 'def'), f1.apply(void 0, [
        'abc'
    ].concat(swcHelpers.toConsumableArray(args))), f1.apply(void 0, swcHelpers.toConsumableArray(args));
}
function f2() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    f0.apply(void 0, swcHelpers.toConsumableArray(args)), f1('abc', 'def'), f1.apply(void 0, [
        'abc'
    ].concat(swcHelpers.toConsumableArray(args))), f1.apply(void 0, swcHelpers.toConsumableArray(args)), f2('abc', 'def'), f2.apply(void 0, [
        'abc'
    ].concat(swcHelpers.toConsumableArray(args))), f2.apply(void 0, swcHelpers.toConsumableArray(args));
}

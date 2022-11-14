//// [argumentExpressionContextualTyping.ts]
// In a typed function call, argument expressions are contextually typed by their corresponding parameter types.
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
function foo(param) {
    var _param_x = _sliced_to_array(param.x, 2), a = _param_x[0], b = _param_x[1], _param_y = param.y, c = _param_y.c, d = _param_y.d, e = _param_y.e;
}
function bar(param) {
    var _param_x = _sliced_to_array(param.x, 2), a = _param_x[0], tmp = _param_x[1], b = tmp === void 0 ? 10 : tmp, _param_y = param.y, c = _param_y.c, d = _param_y.d, _param_y_e = _param_y.e, e = _param_y_e === void 0 ? {
        f: 1
    } : _param_y_e;
}
function baz(x) {}
var o = {
    x: [
        "string",
        1
    ],
    y: {
        c: true,
        d: "world",
        e: 3
    }
};
var o1 = {
    x: [
        "string",
        1
    ],
    y: {
        c: true,
        d: "world",
        e: 3
    }
};
foo(o1); // Not error since x has contextual type of tuple namely [string, number]
foo({
    x: [
        "string",
        1
    ],
    y: {
        c: true,
        d: "world",
        e: 3
    }
}); // Not error
var array = [
    "string",
    1,
    true
];
var tuple = [
    "string",
    1,
    true
];
baz(tuple);
baz([
    "string",
    1,
    true
]);
baz(array); // Error
baz([
    "string",
    1,
    true
].concat(_to_consumable_array(array))); // Error
foo(o); // Error because x has an array type namely (string|number)[]

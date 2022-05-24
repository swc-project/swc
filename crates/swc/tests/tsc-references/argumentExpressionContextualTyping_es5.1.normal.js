import _sliced_to_array from "@swc/helpers/lib/_sliced_to_array.js";
import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
// In a typed function call, argument expressions are contextually typed by their corresponding parameter types.
function foo(param) {
    var _x = _sliced_to_array(param.x, 2), a = _x[0], b = _x[1], _y = param.y, c = _y.c, d = _y.d, e = _y.e;
}
function bar(param) {
    var _x = _sliced_to_array(param.x, 2), a = _x[0], tmp = _x[1], b = tmp === void 0 ? 10 : tmp, _y = param.y, c = _y.c, d = _y.d, _e = _y.e, e = _e === void 0 ? {
        f: 1
    } : _e;
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

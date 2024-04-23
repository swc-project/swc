//// [arraySpreadInCall.ts]
var _action;
f1.apply(void 0, [
    1,
    2,
    3,
    4,
    5,
    6
]);
f1.apply(void 0, [
    1,
    2,
    3,
    4,
    5,
    6
]);
f1.apply(void 0, [
    1,
    2,
    3,
    4,
    5,
    6
]);
f1.apply(void 0, [
    1,
    2,
    3,
    4,
    5,
    6
]);
f1.apply(void 0, [
    1,
    2,
    3,
    4,
    5,
    6
]);
f1.apply(void 0, [
    1,
    2,
    3,
    4,
    5,
    6
]);
var x21 = f2.apply(void 0, [
    1,
    'foo'
]);
var x22 = f2.apply(void 0, [
    true,
    1,
    'foo'
]);
var x23 = f2.apply(void 0, [
    1,
    'foo'
]);
var x24 = f2.apply(void 0, [
    true,
    1,
    'foo'
]);
var x31 = f3.apply(void 0, [
    1,
    'foo'
]);
var x32 = f3.apply(void 0, [
    true,
    1,
    'foo'
]);
var x33 = f3.apply(void 0, [
    1,
    'foo'
]);
var x34 = f3.apply(void 0, [
    true,
    1,
    'foo'
]);
var x41 = f4.apply(void 0, [
    1,
    'foo'
]);
var x42 = f4.apply(void 0, [
    true,
    1,
    'foo'
]);
var x43 = f4.apply(void 0, [
    1,
    'foo'
]);
var x44 = f4.apply(void 0, [
    true,
    1,
    'foo'
]);
(_action = action).run.apply(_action, [
    100,
    'foo'
] // error
);

//// [expString.ts]
var x = "test";
export { };
//// [expNumber.ts]
var x = 42;
export { };
//// [expBoolean.ts]
var x = true;
export { };
//// [expArray.ts]
var x = [
    1,
    2
];
export { };
//// [expObject.ts]
var x = {
    answer: 42,
    when: 1776
};
export { };
//// [expAny.ts]
var x;
export { };
//// [expGeneric.ts]
function x(a) {
    return a;
}
export { };
//// [consumer.ts]
var v1 = iString;
var v2 = iNumber;
var v3 = iBoolean;
var v4 = iArray;
var v5 = iObject;
var v6 = iAny;
var v7 = iGeneric;
export { };

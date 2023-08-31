//// [arrayLiterals2ES6.ts]
// ElementList:  ( Modified )
//      Elisionopt   AssignmentExpression
//      Elisionopt   SpreadElement
//      ElementList, Elisionopt   AssignmentExpression
//      ElementList, Elisionopt   SpreadElement
// SpreadElement:
//      ...   AssignmentExpression
var a0 = [
    ,
    ,
    2,
    3,
    4
], a2 = [
    ,
    ,
    ,
    ...a0,
    "hello"
], a3 = [
    ,
    ,
    ...a0
];
[
    ...a0
];
// The resulting type an array literal expression is determined as follows:
//     - If the array literal contains no spread elements and is an array assignment pattern in a destructuring assignment (section 4.17.1),
//       the resulting type is a tuple type constructed from the types of the element expressions.
var [c0, c1] = [
    1,
    2
], [c2, c3] = [
    1,
    2,
    !0
], temp = [
    "s",
    "t",
    "r"
], temp1 = [
    1,
    2,
    3
]; // tuple type [number, number]
[
    ...temp
], [
    ...temp
], [
    ...temp1
], [
    ...temp1
], [
    ...temp,
    ...temp1
], [
    ...a2
], [
    ...a3
], [
    ...temp1
], [
    ...temp1
];

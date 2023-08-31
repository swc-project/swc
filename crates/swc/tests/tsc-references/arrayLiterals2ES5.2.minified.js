//// [arrayLiterals2ES5.ts]
// ElementList:  ( Modified )
//      Elisionopt   AssignmentExpression
//      Elisionopt   SpreadElement
//      ElementList, Elisionopt   AssignmentExpression
//      ElementList, Elisionopt   SpreadElement
// SpreadElement:
//      ...   AssignmentExpression
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
var a0 = [
    ,
    ,
    2,
    3,
    4
];
[
    ,
    ,
    , 
].concat(_to_consumable_array(a0), [
    "hello"
]), [
    ,
    , 
].concat(_to_consumable_array(a0)), _to_consumable_array(a0).concat([
    , 
]);
var _ref = [
    1,
    2,
    !0
]; // tuple type [number, number, boolean]
_ref[0], _ref[1];
// The resulting type an array literal expression is determined as follows:
//      - the resulting type is an array type with an element type that is the union of the types of the
//        non - spread element expressions and the numeric index signature types of the spread element expressions
var temp = [
    "s",
    "t",
    "r"
], temp1 = [
    1,
    2,
    3
];
[
    1,
    !0
].concat(_to_consumable_array(temp)), _to_consumable_array(temp), _to_consumable_array(temp1), _to_consumable_array(temp1), _to_consumable_array(temp).concat(_to_consumable_array(temp1)), _to_consumable_array([
    void 0,
    null,
    void 0
]), _to_consumable_array([]), _to_consumable_array(_to_consumable_array(temp1)), _to_consumable_array(temp1), [
    _to_consumable_array(temp1)
].concat(_to_consumable_array([
    "hello"
]));

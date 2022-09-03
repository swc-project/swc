//// [arrayLiteralSpreadES5iterable.ts]
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
function f0() {
    var a = [
        1,
        2,
        3
    ];
    _to_consumable_array(a), [
        1
    ].concat(_to_consumable_array(a)), [
        1,
        2
    ].concat(_to_consumable_array(a)), _to_consumable_array(a).concat([
        1
    ]), _to_consumable_array(a).concat([
        1,
        2
    ]), [
        1,
        2
    ].concat(_to_consumable_array(a), [
        1,
        2
    ]), [
        1
    ].concat(_to_consumable_array(a), [
        2
    ], _to_consumable_array(a)), _to_consumable_array(a).concat(_to_consumable_array(a), _to_consumable_array(a));
}
function f1() {
    [
        "hello"
    ].concat(_to_consumable_array([
        1,
        2,
        3
    ]), [
        !0
    ]);
}
function f2() {
    _to_consumable_array(_to_consumable_array(_to_consumable_array(_to_consumable_array(_to_consumable_array([]))))), _to_consumable_array(_to_consumable_array(_to_consumable_array(_to_consumable_array(_to_consumable_array([
        5
    ])))));
}

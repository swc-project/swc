import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
function f0() {
    var a = [
        1,
        2,
        3
    ];
    var a1 = _to_consumable_array(a);
    var a2 = [
        1
    ].concat(_to_consumable_array(a));
    var a3 = [
        1,
        2
    ].concat(_to_consumable_array(a));
    var a4 = _to_consumable_array(a).concat([
        1
    ]);
    var a5 = _to_consumable_array(a).concat([
        1,
        2
    ]);
    var a6 = [
        1,
        2
    ].concat(_to_consumable_array(a), [
        1,
        2
    ]);
    var a7 = [
        1
    ].concat(_to_consumable_array(a), [
        2
    ], _to_consumable_array(a));
    var a8 = _to_consumable_array(a).concat(_to_consumable_array(a), _to_consumable_array(a));
}
function f1() {
    var a = [
        1,
        2,
        3
    ];
    var b = [
        "hello"
    ].concat(_to_consumable_array(a), [
        true
    ]);
    var b;
}
function f2() {
    var a = _to_consumable_array(_to_consumable_array(_to_consumable_array(_to_consumable_array(_to_consumable_array([])))));
    var b = _to_consumable_array(_to_consumable_array(_to_consumable_array(_to_consumable_array(_to_consumable_array([
        5
    ])))));
}

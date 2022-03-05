import * as swcHelpers from "@swc/helpers";
// @downlevelIteration: true
function f0() {
    var a = [
        1,
        2,
        3
    ];
    var a1 = swcHelpers.toConsumableArray(a);
    var a2 = [
        1
    ].concat(swcHelpers.toConsumableArray(a));
    var a3 = [
        1,
        2
    ].concat(swcHelpers.toConsumableArray(a));
    var a4 = swcHelpers.toConsumableArray(a).concat([
        1
    ]);
    var a5 = swcHelpers.toConsumableArray(a).concat([
        1,
        2
    ]);
    var a6 = [
        1,
        2
    ].concat(swcHelpers.toConsumableArray(a), [
        1,
        2
    ]);
    var a7 = [
        1
    ].concat(swcHelpers.toConsumableArray(a), [
        2
    ], swcHelpers.toConsumableArray(a));
    var a8 = swcHelpers.toConsumableArray(a).concat(swcHelpers.toConsumableArray(a), swcHelpers.toConsumableArray(a));
}
function f1() {
    var a = [
        1,
        2,
        3
    ];
    var b = [
        "hello"
    ].concat(swcHelpers.toConsumableArray(a), [
        true
    ]);
    var b;
}
function f2() {
    var a = swcHelpers.toConsumableArray(swcHelpers.toConsumableArray(swcHelpers.toConsumableArray(swcHelpers.toConsumableArray(swcHelpers.toConsumableArray([])))));
    var b = swcHelpers.toConsumableArray(swcHelpers.toConsumableArray(swcHelpers.toConsumableArray(swcHelpers.toConsumableArray(swcHelpers.toConsumableArray([
        5
    ])))));
}

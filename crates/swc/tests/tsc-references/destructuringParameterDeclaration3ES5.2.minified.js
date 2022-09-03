//// [destructuringParameterDeclaration3ES5.ts]
function a1(...x) {}
function a2(...a) {}
function a3(...a) {}
function a4(...a) {}
function a5(...a) {}
function a9([a, b, [[c]]]) {}
function a10([a, b, [[c]], ...x]) {}
function a11([a, b, c, ...x]) {}
var E, E1, array = [
    1,
    2,
    3
], array2 = [
    !0,
    !1,
    "hello"
];
function foo(...a) {}
function foo1(...a) {}
a2([
    ...array
]), a1(...array), a9([
    1,
    2,
    [
        [
            "string"
        ]
    ],
    !1,
    !0
]), a10([
    1,
    2,
    [
        [
            "string"
        ]
    ],
    !1,
    !0
]), a10([
    1,
    2,
    3,
    !1,
    !0
]), a10([
    1,
    2
]), a11([
    1,
    2
]), foo("hello", 1, 2), foo("hello", "world"), function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b";
}(E || (E = {})), function(E1) {
    E1[E1.a = 0] = "a", E1[E1.b = 1] = "b";
}(E1 || (E1 = {})), foo1(1, 2, 3, E.a), foo1(1, 2, 3, 0, E.b);

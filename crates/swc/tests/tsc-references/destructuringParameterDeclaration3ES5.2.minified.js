//// [destructuringParameterDeclaration3ES5.ts]
function a10([a, b, [[c]], ...x]) {}
!function([a, b, [[c]]]) {}([
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
]), function([a, b, c, ...x]) {}([
    1,
    2
]);
var E, E1 = ((E = E1 || {})[E.a = 0] = "a", E[E.b = 1] = "b", E);

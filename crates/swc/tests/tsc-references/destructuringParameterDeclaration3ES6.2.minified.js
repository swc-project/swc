//// [destructuringParameterDeclaration3ES6.ts]
var E, array = [
    1,
    2,
    3
];
!function(...a) {}([
    ...array
]), function(...x) {}(...array), function([a, b, [[c]]]) {}([
    1,
    2,
    [
        [
            "string"
        ]
    ],
    !1,
    !0
]), function([a, b, c, ...x]) {}([
    1,
    2
]);
var E1 = ((E = E1 || {})[E.a = 0] = "a", E[E.b = 1] = "b", E);

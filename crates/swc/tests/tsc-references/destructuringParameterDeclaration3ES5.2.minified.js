//// [destructuringParameterDeclaration3ES5.ts]
var E, array = [
    1,
    2,
    3
];
[
    ...array
], [
    ...array
], function([a, b, [[c]]]) {}([
    1,
    2,
    [
        [
            "string"
        ]
    ],
    !1,
    !0
]), function([a, b, [[c]], ...x]) {}([
    1,
    2,
    [
        [
            "string"
        ]
    ],
    !1,
    !0
]), function([a, b, [[c]], ...x]) {}([
    1,
    2,
    3,
    !1,
    !0
]), function([a, b, [[c]], ...x]) {}([
    1,
    2
]), function([a, b, c, ...x]) {}([
    1,
    2
]);
var E1 = ((E = E1 || {})[E.a = 0] = "a", E[E.b = 1] = "b", E);

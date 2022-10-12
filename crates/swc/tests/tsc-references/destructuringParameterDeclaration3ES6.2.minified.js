//// [destructuringParameterDeclaration3ES6.ts]
var E, E1, array = [
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
]), function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b";
}(E || (E = {})), function(E1) {
    E1[E1.a = 0] = "a", E1[E1.b = 1] = "b";
}(E1 || (E1 = {})), E.a, E.b;

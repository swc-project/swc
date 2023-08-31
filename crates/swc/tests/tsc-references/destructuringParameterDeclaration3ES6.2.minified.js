//// [destructuringParameterDeclaration3ES6.ts]
// If the parameter is a rest parameter, the parameter type is any[]
// A type annotation for a rest parameter must denote an array type.
// RestParameter:
//     ...   Identifier   TypeAnnotation(opt)
var E, E1, E2, E11, array = [
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
]), (E = E2 || (E2 = {}))[E.a = 0] = "a", E[E.b = 1] = "b", (E1 = E11 || (E11 = {}))[E1.a = 0] = "a", E1[E1.b = 1] = "b", E2.a, E2.b;

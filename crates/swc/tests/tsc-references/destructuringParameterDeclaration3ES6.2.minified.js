//// [destructuringParameterDeclaration3ES6.ts]
// If the parameter is a rest parameter, the parameter type is any[]
// A type annotation for a rest parameter must denote an array type.
// RestParameter:
//     ...   Identifier   TypeAnnotation(opt)
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
]), (E = E1 || (E1 = {}))[E.a = 0] = "a", E[E.b = 1] = "b";

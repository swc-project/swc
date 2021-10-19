var E, E1, E2, E11;
function a10([a, b, [[c]], ...x]) {
}
function foo(...a) {
}
function foo1(...a) {
}
a10([
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
]), foo("hello", 1, 2), foo("hello", "world"), (E = E2 || (E2 = {
}))[E.a = 0] = "a", E[E.b = 1] = "b", (E1 = E11 || (E11 = {
}))[E1.a = 0] = "a", E1[E1.b = 1] = "b", foo1(1, 2, 3, E2.a), foo1(1, 2, 3, E11.a, E2.b);

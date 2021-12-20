var E, E1, E, E1;
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
]), foo("hello", 1, 2), foo("hello", "world"), (E = E || (E = {
}))[E.a = 0] = "a", E[E.b = 1] = "b", (E1 = E1 || (E1 = {
}))[E1.a = 0] = "a", E1[E1.b = 1] = "b", foo1(1, 2, 3, E.a), foo1(1, 2, 3, E1.a, E.b);

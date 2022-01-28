(function ([]) {});
(function ({}) {});
(function ([, , , , ,]) {});
(function ([a, { b: c }]) {});
(function ([...args]) {});
(function ({ x: x }) {});
class a {
    *method({ [thrower()]: x } = {}) {}
}
(function (
    a,
    b,
    c,
    d,
    [
        {
            e: [...f],
        },
    ]
) {})(1, 2, 3, 4, [{ e: [1, 2, 3] }]);

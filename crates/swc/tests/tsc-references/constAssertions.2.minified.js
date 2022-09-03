//// [constAssertions.ts]
let v1 = 'abc', v2 = "abc", v3 = 10, v4 = -10, v5 = 10, v6 = 10n, v7 = -10n, v8 = !0, v9 = !1, c1 = 'abc', c2 = "abc", c3 = 10, c4 = -10, c5 = 10, c6 = 10n, c7 = -10n, c8 = !0, c9 = !1, vv1 = v1, vc1 = c1, a1 = [], a2 = [
    1,
    2,
    3
], a3 = [
    10,
    'hello',
    !0
], a4 = [
    1,
    2,
    3
], a5 = [
    1,
    2,
    3
], a6 = [
    ...a5
], a7 = [
    ...a6
], a8 = [
    'abc',
    ...a7
], a9 = [
    ...a8
], o1 = {
    x: 10,
    y: 20
}, o2 = {
    a: 1,
    b: 2,
    c: 3,
    d () {},
    e: 4
}, o3 = {
    ...o1,
    ...o2
}, o4 = {
    a: 1,
    b: 2
}, o5 = {
    ...o4
}, o6 = {
    ...o5
}, o7 = {
    ...d
}, o8 = {
    ...o7
}, o9 = {
    x: 10,
    foo () {
        this.x = 20;
    }
}, p1 = 10, p2 = -10, p3 = [
    10
], p4 = [
    [
        [
            [
                10
            ]
        ]
    ]
], x1 = {
    x: 10,
    y: [
        20,
        30
    ],
    z: {
        a: {
            b: 42
        }
    }
}, q1 = 10, q2 = 'abc', q3 = !0, q4 = [
    1,
    2,
    3
], q5 = {
    x: 10,
    y: 20
}, e1 = v1, e2 = 1, e3 = id(1), t1 = 'foo', t2 = 'bar', t3 = `${t1}-${t2}`, t4 = `(${t1})-(${t2})`;
function ff1(x, y) {
    return `${x}-${y}`;
}
function ff2(x, y) {
    return `${x}-${y}`;
}
const ts1 = ff2('foo', 'bar'), ts2 = ff2('foo', '0'), ts3 = ff2('top', 'left');
function ff3(x, y) {
    return `${x}${y}`;
}
function ff4(verify, contentMatches) {
    let outcome = `${verify ? "verify" : "write"}_${contentMatches ? "match" : "nonMatch"}`;
    return outcome;
}
function ff5(verify, contentMatches) {
    let outcome = `${verify ? "verify" : "write"}_${contentMatches ? "match" : "nonMatch"}`;
    return outcome;
}
function accessorNames(propName) {
    return [
        `get-${propName}`,
        `set-${propName}`
    ];
}
const ns1 = accessorNames('foo');

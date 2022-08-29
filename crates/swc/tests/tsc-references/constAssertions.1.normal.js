//// [constAssertions.ts]
let v1 = 'abc';
let v2 = `abc`;
let v3 = 10;
let v4 = -10;
let v5 = +10;
let v6 = 10n;
let v7 = -10n;
let v8 = true;
let v9 = false;
let c1 = 'abc';
let c2 = `abc`;
let c3 = 10;
let c4 = -10;
let c5 = +10;
let c6 = 10n;
let c7 = -10n;
let c8 = true;
let c9 = false;
let vv1 = v1;
let vc1 = c1;
let a1 = [];
let a2 = [
    1,
    2,
    3
];
let a3 = [
    10,
    'hello',
    true
];
let a4 = [
    ...[
        1,
        2,
        3
    ]
];
let a5 = [
    1,
    2,
    3
];
let a6 = [
    ...a5
];
let a7 = [
    ...a6
];
let a8 = [
    'abc',
    ...a7
];
let a9 = [
    ...a8
];
let o1 = {
    x: 10,
    y: 20
};
let o2 = {
    a: 1,
    'b': 2,
    ['c']: 3,
    d () {},
    ['e' + '']: 4
};
let o3 = {
    ...o1,
    ...o2
};
let o4 = {
    a: 1,
    b: 2
};
let o5 = {
    ...o4
};
let o6 = {
    ...o5
};
let o7 = {
    ...d
};
let o8 = {
    ...o7
};
let o9 = {
    x: 10,
    foo () {
        this.x = 20;
    }
}; // Error
let p1 = 10;
let p2 = -10;
let p3 = [
    10
];
let p4 = [
    [
        [
            [
                10
            ]
        ]
    ]
];
let x1 = {
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
};
let q1 = 10;
let q2 = 'abc';
let q3 = true;
let q4 = [
    1,
    2,
    3
];
let q5 = {
    x: 10,
    y: 20
};
let e1 = v1; // Error
let e2 = true ? 1 : 0; // Error
let e3 = id(1); // Error
let t1 = 'foo';
let t2 = 'bar';
let t3 = `${t1}-${t2}`;
let t4 = `${`(${t1})`}-${`(${t2})`}`;
function ff1(x, y) {
    return `${x}-${y}`;
}
function ff2(x, y) {
    return `${x}-${y}`;
}
const ts1 = ff2('foo', 'bar');
const ts2 = ff2('foo', !!true ? '0' : '1');
const ts3 = ff2(!!true ? 'top' : 'bottom', !!true ? 'left' : 'right');
function ff3(x, y) {
    return `${x}${y}`;
}
function ff4(verify, contentMatches) {
    const action = verify ? `verify` : `write`;
    const contentMatch = contentMatches ? `match` : `nonMatch`;
    const outcome = `${action}_${contentMatch}`;
    return outcome;
}
function ff5(verify, contentMatches) {
    const action = verify ? `verify` : `write`;
    const contentMatch = contentMatches ? `match` : `nonMatch`;
    const outcome = `${action}_${contentMatch}`;
    return outcome;
}
function accessorNames(propName) {
    return [
        `get-${propName}`,
        `set-${propName}`
    ];
}
const ns1 = accessorNames('foo');

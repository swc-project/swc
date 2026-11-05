var _ref, _ref1;
const _ref2 = [
    1,
    2
], [..._ref3] = _ref2, {} = _ref3, direct = _extends({}, _ref3);
const _ref4 = [
    {
        a: 1
    }
], [..._ref5] = _ref4, { 0: _ref6 } = _ref5, {} = _ref6, nestedObject = _extends({}, _ref6);
const _ref7 = [
    {
        a: 1
    }
], [..._ref8] = _ref7, [_ref9] = _ref8, {} = _ref9, nestedArray = _extends({}, _ref9);
console.log(JSON.stringify([
    direct,
    nestedObject,
    nestedArray
]));
const _ref10 = [
    0,
    1,
    2,
    3,
    4
], [head, , ..._ref11] = _ref10, { 0: first } = _ref11, tail = _object_without_properties(_ref11, [
    "0"
]);
console.log(JSON.stringify([
    head,
    first,
    tail
]));
let assigned;
const source = [
    1,
    2
];
const result = (_ref = source, [..._ref1] = _ref, {} = _ref1, assigned = _extends({}, _ref1), _ref);
console.log(result === source, JSON.stringify(assigned));
function unpack(_0) {
    let [..._ref] = _0, {} = _ref, rest = _extends({}, _ref);
    return rest;
}
console.log(JSON.stringify(unpack([
    3,
    4
])));
for (const _ref of [
    [
        {
            b: 2
        }
    ]
]){
    const [..._ref1] = _ref, [_ref2] = _ref1, {} = _ref2, rest = _extends({}, _ref2);
    console.log(JSON.stringify(rest));
}
let calls = 0;
function* values() {
    calls++;
    yield 0;
    calls++;
    yield 1;
    calls++;
    yield 2;
}
const _values = values(), [initial, ..._ref12] = _values, {} = _ref12, remaining = _extends({}, _ref12);
console.log(initial, calls, JSON.stringify(remaining));

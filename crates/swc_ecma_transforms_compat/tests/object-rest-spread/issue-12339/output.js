var _ref;
const _ref1 = [
    1,
    2
], [..._ref2] = _ref1, {} = _ref2, direct = _extends({}, _ref2);
const _ref3 = [
    {
        a: 1
    }
], [..._ref4] = _ref3, { 0: _ref5 } = _ref4, {} = _ref5, nestedObject = _extends({}, _ref5);
const _ref6 = [
    {
        a: 1
    }
], [..._ref7] = _ref6, [_ref8] = _ref7, {} = _ref8, nestedArray = _extends({}, _ref8);
console.log(JSON.stringify([
    direct,
    nestedObject,
    nestedArray
]));
const _ref9 = [
    0,
    1,
    2,
    3,
    4
], [head, , ..._ref10] = _ref9, { 0: first } = _ref10, tail = _object_without_properties(_ref10, [
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
const result = ([..._ref] = source, {} = _ref, assigned = _extends({}, _ref), source);
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
const _values = values(), [initial, ..._ref11] = _values, {} = _ref11, remaining = _extends({}, _ref11);
console.log(initial, calls, JSON.stringify(remaining));

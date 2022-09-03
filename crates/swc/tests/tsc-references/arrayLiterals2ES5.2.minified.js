//// [arrayLiterals2ES5.ts]
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
var a0 = [
    ,
    ,
    2,
    3,
    4
], a1 = [
    "hello",
    "world"
], a2 = [
    ,
    ,
    , 
].concat(_to_consumable_array(a0), [
    "hello"
]), a3 = [
    ,
    , 
].concat(_to_consumable_array(a0)), a4 = [
    function() {
        return 1;
    }, 
], a5 = _to_consumable_array(a0).concat([
    , 
]), b0 = [
    void 0,
    null,
    void 0
], b1 = [
    [
        1,
        2,
        3
    ],
    [
        "hello",
        "string"
    ]
], c0 = 1, c1 = 2, ref = [
    1,
    2,
    !0
], c2 = ref[0], c3 = ref[1], temp = [
    "s",
    "t",
    "r"
], temp1 = [
    1,
    2,
    3
], temp2 = [
    [
        1,
        2,
        3
    ],
    [
        "hello",
        "string"
    ]
], temp3 = [
    void 0,
    null,
    void 0
], temp4 = [], d0 = [
    1,
    !0, 
].concat(_to_consumable_array(temp)), d1 = _to_consumable_array(temp), d2 = _to_consumable_array(temp1), d3 = _to_consumable_array(temp1), d4 = _to_consumable_array(temp).concat(_to_consumable_array(temp1)), d5 = _to_consumable_array(temp3), d6 = _to_consumable_array(temp4), d7 = _to_consumable_array(_to_consumable_array(temp1)), d8 = [
    _to_consumable_array(temp1)
], d9 = [
    _to_consumable_array(temp1)
].concat(_to_consumable_array([
    "hello"
]));

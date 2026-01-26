// Test case for issue #11142: TypeScript expressions in destructuring assignment
// ============================================
// Expr::TsNonNull - Non-null assertion: expr!
// ============================================
// Original issue case: array element swapping with non-null assertions
var arrayCopy = [
    1,
    2,
    3
];
var currentIndex = 0;
var randomIndex = 1;
var ref;
ref = [
    arrayCopy[randomIndex],
    arrayCopy[currentIndex]
], arrayCopy[currentIndex] = ref[0], arrayCopy[randomIndex] = ref[1], ref;
// Simple non-null assertion in array destructuring
var a = 1;
var b = 2;
var ref1;
ref1 = [
    b,
    a
], a = ref1[0], b = ref1[1], ref1;
// Non-null assertion with member expressions
var obj = {
    x: 1,
    y: 2
};
var ref2;
ref2 = [
    obj.y,
    obj.x
], obj.x = ref2[0], obj.y = ref2[1], ref2;
var ref3;
// Non-null assertion in object destructuring
ref3 = {
    x: 5
}, obj.x = ref3.x, ref3;
// Complex nested case
var arr = [
    [
        1,
        2
    ],
    [
        3,
        4
    ]
];
var ref4;
ref4 = [
    arr[1][1],
    arr[0][0]
], arr[0][0] = ref4[0], arr[1][1] = ref4[1], ref4;
// ============================================
// Expr::TsTypeAssertion - Type assertion: <Type>expr
// ============================================
// Type assertion in array destructuring
var x = 1;
var y = 2;
var ref5;
ref5 = [
    y,
    x
], x = ref5[0], y = ref5[1], ref5;
// Type assertion with member expression
var data = {
    value: 10
};
data.value = 20;
var ref6;
// Type assertion in object destructuring
ref6 = {
    prop: 30
}, data.value = ref6.prop, ref6;
var fn1;
var fn2;
var ref7;
ref7 = [
    identity,
    identity
], fn1 = ref7[0], fn2 = ref7[1], ref7;
// ============================================
// Expr::TsSatisfies - Satisfies expression: expr satisfies Type
// ============================================
// Satisfies in array destructuring
var s1 = "hello";
var s2 = "world";
var ref8;
ref8 = [
    s2,
    s1
], s1 = ref8[0], s2 = ref8[1], ref8;
// Satisfies with member expression
var config = {
    setting: "value"
};
config.setting = "new value";
var ref9;
// Satisfies in object destructuring
ref9 = {
    key: "updated"
}, config.setting = ref9.key, ref9;
// ============================================
// Combined cases
// ============================================
// Multiple TypeScript expression types in same destructuring
var mixed = {
    a: 1,
    b: 2
};
var ref10;
ref10 = [
    mixed.b,
    mixed.a
], mixed.a = ref10[0], mixed.b = ref10[1], ref10;

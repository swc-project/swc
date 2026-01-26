// Test case 1: Object property destructuring assignment
const bin = {
    hasMore: !1,
    hasDisorder: !1
};
[bin.hasMore, bin.hasDisorder] = [
    !0,
    !0
];
console.log(bin.hasMore, bin.hasDisorder);
// Test case 2: Array element destructuring assignment
const arr = [
    1,
    2
];
[arr[0], arr[1]] = [
    arr[1],
    arr[0]
];
console.log(arr);
// Test case 3: Nested object destructuring
const obj = {
    a: {
        x: 0
    },
    b: {
        y: 0
    }
};
[obj.a.x, obj.b.y] = [
    10,
    20
];
console.log(obj.a.x, obj.b.y);
// Test case 4: Mixed literals and expressions
const state = {
    flag: !1
};
[state.flag] = [
    !0
];
console.log(state.flag);

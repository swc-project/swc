const bin = {
    hasMore: !1,
    hasDisorder: !1
};
[bin.hasMore, bin.hasDisorder] = [!0, !0];
console.log(bin.hasMore, bin.hasDisorder);
const arr = [
    1,
    2
];
[arr[0], arr[1]] = [
    arr[1],
    arr[0]
];
console.log(arr);
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
const state = {
    flag: !1
};
[state.flag] = [
    !0
];
console.log(state.flag);

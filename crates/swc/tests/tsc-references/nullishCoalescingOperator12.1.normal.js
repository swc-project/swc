//// [nullishCoalescingOperator12.ts]
const obj = {
    arr: []
};
var ref;
for (const i of (ref = obj === null || obj === void 0 ? void 0 : obj.arr) !== null && ref !== void 0 ? ref : []){}

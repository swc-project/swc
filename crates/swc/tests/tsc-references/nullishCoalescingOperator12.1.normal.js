//// [nullishCoalescingOperator12.ts]
const obj = {
    arr: []
};
var _ref;
for (const i of (_ref = obj === null || obj === void 0 ? void 0 : obj.arr) !== null && _ref !== void 0 ? _ref : []){}

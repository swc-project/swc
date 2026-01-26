//// [nullishCoalescingOperator12.ts]
var _ref;
let obj = {
    arr: []
};
for (let i of null != (_ref = null == obj ? void 0 : obj.arr) ? _ref : []);

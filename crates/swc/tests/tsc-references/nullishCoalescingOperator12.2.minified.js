//// [nullishCoalescingOperator12.ts]
var _ref;
const obj = {
    arr: []
};
for (const i of null !== (_ref = null == obj ? void 0 : obj.arr) && void 0 !== _ref ? _ref : []);

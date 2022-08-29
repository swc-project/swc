//// [nullishCoalescingOperator12.ts]
var ref;
const obj = {
    arr: []
};
for (const i of null !== (ref = null == obj ? void 0 : obj.arr) && void 0 !== ref ? ref : []);

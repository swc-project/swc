//// [nullishCoalescingOperator12.ts]
var _obj_arr;
const obj = {
    arr: []
};
for (const i of null !== (_obj_arr = null == obj ? void 0 : obj.arr) && void 0 !== _obj_arr ? _obj_arr : []);

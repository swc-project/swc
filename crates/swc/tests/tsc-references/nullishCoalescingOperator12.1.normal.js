//// [nullishCoalescingOperator12.ts]
const obj = {
    arr: []
};
var _obj_arr;
for (const i of (_obj_arr = obj === null || obj === void 0 ? void 0 : obj.arr) !== null && _obj_arr !== void 0 ? _obj_arr : []){}

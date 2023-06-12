//// [nullishCoalescingOperator12.ts]
var _obj;
const obj = {
    arr: []
};
var _obj_arr;
for (const i of (_obj_arr = (_obj = obj) === null || _obj === void 0 ? void 0 : _obj.arr) !== null && _obj_arr !== void 0 ? _obj_arr : []){}

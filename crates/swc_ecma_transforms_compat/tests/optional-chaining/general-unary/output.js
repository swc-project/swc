"use strict";
var _obj_a, _obj, _obj_a1, _obj_b, _obj1, _obj_b1, _obj2;
const obj = {
    a: {
        b: 0
    }
};
let test = +((_obj_a = (_obj = obj) === null || _obj === void 0 ? void 0 : _obj.a) === null || _obj_a === void 0 ? void 0 : _obj_a.b);
test = +((_obj_a1 = obj) === null || _obj_a1 === void 0 ? void 0 : _obj_a1.a.b);
test = +((_obj_b = (_obj1 = obj) === null || _obj1 === void 0 ? void 0 : _obj1.b) === null || _obj_b === void 0 ? void 0 : _obj_b.b);
test = +((_obj_b1 = (_obj2 = obj) === null || _obj2 === void 0 ? void 0 : _obj2.b) === null || _obj_b1 === void 0 ? void 0 : _obj_b1.b);

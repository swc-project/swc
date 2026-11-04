"use strict";
var _obj_a, _obj_b, _obj_b1;
const obj = {
    a: {
        b: 0
    }
};
let test = +(obj === null || obj === void 0 ? void 0 : (_obj_a = obj.a) === null || _obj_a === void 0 ? void 0 : _obj_a.b);
test = +(obj === null || obj === void 0 ? void 0 : obj.a.b);
test = +(obj === null || obj === void 0 ? void 0 : (_obj_b = obj.b) === null || _obj_b === void 0 ? void 0 : _obj_b.b);
test = +(obj === null || obj === void 0 ? void 0 : (_obj_b1 = obj.b) === null || _obj_b1 === void 0 ? void 0 : _obj_b1.b);

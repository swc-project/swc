"use strict";
var _obj_a, _obj, _obj1, _obj_b, _obj2, _obj3;
const obj = {
    a: {
        b: 0
    }
};
let test = (_obj_a = (_obj = obj) === null || _obj === void 0 ? void 0 : _obj.a) === null || _obj_a === void 0 ? void 0 : delete _obj_a.b;
test = (_obj1 = obj) === null || _obj1 === void 0 ? void 0 : delete _obj1.a.b;
test = (_obj_b = (_obj2 = obj) === null || _obj2 === void 0 ? void 0 : _obj2.b) === null || _obj_b === void 0 ? void 0 : delete _obj_b.b;
(_obj3 = obj) === null || _obj3 === void 0 ? void 0 : delete _obj3.a;

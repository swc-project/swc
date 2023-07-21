"use strict";
var _obj, _obj_a, _obj1, _obj_b, _obj2, _obj_a1, _obj3;
const obj = {
    a: {
        b: {
            c: {
                d: 2
            }
        }
    }
};
const a = (_obj = obj) === null || _obj === void 0 ? void 0 : _obj.a;
const b = (_obj1 = obj) === null || _obj1 === void 0 ? void 0 : (_obj_a = _obj1.a) === null || _obj_a === void 0 ? void 0 : _obj_a.b;
const bad = (_obj2 = obj) === null || _obj2 === void 0 ? void 0 : (_obj_b = _obj2.b) === null || _obj_b === void 0 ? void 0 : _obj_b.b;
let val;
val = (_obj3 = obj) === null || _obj3 === void 0 ? void 0 : (_obj_a1 = _obj3.a) === null || _obj_a1 === void 0 ? void 0 : _obj_a1.b;

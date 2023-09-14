"use strict";
var _obj_a, _obj_b, _obj_a1;
const obj = {
    a: {
        b: {
            c: {
                d: 2
            }
        }
    }
};
const a = obj === null || obj === void 0 ? void 0 : obj.a;
const b = obj === null || obj === void 0 ? void 0 : (_obj_a = obj.a) === null || _obj_a === void 0 ? void 0 : _obj_a.b;
const bad = obj === null || obj === void 0 ? void 0 : (_obj_b = obj.b) === null || _obj_b === void 0 ? void 0 : _obj_b.b;
let val;
val = obj === null || obj === void 0 ? void 0 : (_obj_a1 = obj.a) === null || _obj_a1 === void 0 ? void 0 : _obj_a1.b;

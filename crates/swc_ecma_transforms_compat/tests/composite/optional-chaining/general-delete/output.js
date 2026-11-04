"use strict";
var _obj_a, _obj_b;
const obj = {
    a: {
        b: 0
    }
};
let test = obj === null || obj === void 0 ? true : (_obj_a = obj.a) === null || _obj_a === void 0 ? true : delete _obj_a.b;
test = obj === null || obj === void 0 ? true : delete obj.a.b;
test = obj === null || obj === void 0 ? true : (_obj_b = obj.b) === null || _obj_b === void 0 ? true : delete _obj_b.b;
obj === null || obj === void 0 ? true : delete obj.a;

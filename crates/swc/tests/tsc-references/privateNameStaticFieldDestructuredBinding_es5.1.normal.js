import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _sliced_to_array from "@swc/helpers/lib/_sliced_to_array.js";
import _class_static_private_field_destructure from "@swc/helpers/lib/_class_static_private_field_destructure.js";
// @target: esnext, es2022, es2015
// @useDefineForClassFields: false
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
        this.otherClass = A;
        var y;
        var ref;
        ref = this.testObject(), _class_static_private_field_destructure(A, A, _field).value = ref.x, y = ref.y, ref;
        var ref1;
        ref1 = _sliced_to_array(this.testArray(), 2), _class_static_private_field_destructure(A, A, _field).value = ref1[0], y = ref1[1], ref1;
        var ref2, ref3;
        ref2 = {
            a: 1,
            b: [
                2
            ]
        }, _class_static_private_field_destructure(A, A, _field).value = ref2.a, ref3 = _sliced_to_array(ref2.b, 1), _class_static_private_field_destructure(A, A, _field).value = ref3[0], ref3, ref2;
        var ref4;
        _class_static_private_field_destructure(A, A, _field).value = 1, ref4 = [
            2
        ], _class_static_private_field_destructure(A, A, _field).value = ref4[0], ref4;
        var ref5, ref6, ref7, ref8;
        ref5 = {
            b: []
        }, ref6 = ref5.a, _class_static_private_field_destructure(A, A, _field).value = ref6 === void 0 ? 1 : ref6, ref7 = _sliced_to_array(ref5.b, 1), ref8 = ref7[0], _class_static_private_field_destructure(A, A, _field).value = ref8 === void 0 ? 1 : ref8, ref7, ref5;
        var ref9, ref10;
        ref9 = [], ref10 = ref9[0], _class_static_private_field_destructure(A, A, _field).value = ref10 === void 0 ? 2 : ref10, ref9;
        var ref11, ref12;
        ref11 = [], ref12 = ref11[0], _class_static_private_field_destructure(this.otherClass, A, _field).value = ref12 === void 0 ? 2 : ref12, ref11;
    }
    var _proto = A.prototype;
    _proto.testObject = function testObject() {
        return {
            x: 10,
            y: 6
        };
    };
    _proto.testArray = function testArray() {
        return [
            10,
            11
        ];
    };
    A.test = function test(_a) {
        _class_static_private_field_destructure(_a, A, _field).value = 2;
    };
    return A;
}();
var _field = {
    writable: true,
    value: 1
};

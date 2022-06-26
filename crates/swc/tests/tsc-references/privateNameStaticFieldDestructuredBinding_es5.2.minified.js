import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _class_static_private_field_destructure from "@swc/helpers/src/_class_static_private_field_destructure.mjs";
var A = function() {
    "use strict";
    function A() {
        var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
        _class_call_check(this, A), this.otherClass = A, ref = this.testObject(), _class_static_private_field_destructure(A, A, _field).value = ref.x, ref.y, ref1 = _sliced_to_array(this.testArray(), 2), _class_static_private_field_destructure(A, A, _field).value = ref1[0], ref1[1], ref2 = {
            a: 1,
            b: [
                2
            ]
        }, _class_static_private_field_destructure(A, A, _field).value = ref2.a, ref3 = _sliced_to_array(ref2.b, 1), _class_static_private_field_destructure(A, A, _field).value = ref3[0], _class_static_private_field_destructure(A, A, _field).value = 1, ref4 = [
            2
        ], _class_static_private_field_destructure(A, A, _field).value = ref4[0], ref6 = (ref5 = {
            b: []
        }).a, _class_static_private_field_destructure(A, A, _field).value = void 0 === ref6 ? 1 : ref6, ref7 = _sliced_to_array(ref5.b, 1)[0], _class_static_private_field_destructure(A, A, _field).value = void 0 === ref7 ? 1 : ref7, ref8 = void 0, _class_static_private_field_destructure(A, A, _field).value = void 0 === ref8 ? 2 : ref8, ref9 = void 0, _class_static_private_field_destructure(this.otherClass, A, _field).value = void 0 === ref9 ? 2 : ref9;
    }
    var _proto = A.prototype;
    return _proto.testObject = function() {
        return {
            x: 10,
            y: 6
        };
    }, _proto.testArray = function() {
        return [
            10,
            11
        ];
    }, A.test = function(_a) {
        _class_static_private_field_destructure(_a, A, _field).value = 2;
    }, A;
}(), _field = {
    writable: !0,
    value: 1
};

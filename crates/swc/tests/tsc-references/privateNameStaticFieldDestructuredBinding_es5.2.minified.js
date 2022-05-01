import * as swcHelpers from "@swc/helpers";
var A = function() {
    "use strict";
    function A() {
        var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
        swcHelpers.classCallCheck(this, A), this.otherClass = A, ref = this.testObject(), swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = ref.x, ref.y, ref1 = swcHelpers.slicedToArray(this.testArray(), 2), swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = ref1[0], ref1[1], ref2 = {
            a: 1,
            b: [
                2
            ]
        }, swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = ref2.a, ref3 = swcHelpers.slicedToArray(ref2.b, 1), swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = ref3[0], swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = 1, ref4 = [
            2
        ], swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = ref4[0], ref6 = (ref5 = {
            b: []
        }).a, swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = void 0 === ref6 ? 1 : ref6, ref7 = swcHelpers.slicedToArray(ref5.b, 1)[0], swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = void 0 === ref7 ? 1 : ref7, ref8 = void 0, swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = void 0 === ref8 ? 2 : ref8, ref9 = void 0, swcHelpers.classStaticPrivateFieldDestructureSet(this.otherClass, A, _field).value = void 0 === ref9 ? 2 : ref9;
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
        swcHelpers.classStaticPrivateFieldDestructureSet(_a, A, _field).value = 2;
    }, A;
}(), _field = {
    writable: !0,
    value: 1
};

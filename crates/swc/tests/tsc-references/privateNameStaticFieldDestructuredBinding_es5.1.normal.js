import * as swcHelpers from "@swc/helpers";
// @target: esnext, es2022, es2015
// @useDefineForClassFields: false
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
        this.otherClass = A;
        var y;
        var ref;
        ref = this.testObject(), swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = ref.x, y = ref.y, ref;
        var ref1;
        ref1 = swcHelpers.slicedToArray(this.testArray(), 2), swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = ref1[0], y = ref1[1], ref1;
        var ref2, ref3;
        ref2 = {
            a: 1,
            b: [
                2
            ]
        }, swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = ref2.a, ref3 = swcHelpers.slicedToArray(ref2.b, 1), swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = ref3[0], ref3, ref2;
        var ref4;
        swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = 1, ref4 = [
            2
        ], swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = ref4[0], ref4;
        var ref5, ref6, ref7, ref8;
        ref5 = {
            b: []
        }, ref6 = ref5.a, swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = ref6 === void 0 ? 1 : ref6, ref7 = swcHelpers.slicedToArray(ref5.b, 1), ref8 = ref7[0], swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = ref8 === void 0 ? 1 : ref8, ref7, ref5;
        var ref9, ref10;
        ref9 = [], ref10 = ref9[0], swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = ref10 === void 0 ? 2 : ref10, ref9;
        var ref11, ref12;
        ref11 = [], ref12 = ref11[0], swcHelpers.classStaticPrivateFieldDestructureSet(this.otherClass, A, _field).value = ref12 === void 0 ? 2 : ref12, ref11;
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
        swcHelpers.classStaticPrivateFieldDestructureSet(_a, A, _field).value = 2;
    };
    return A;
}();
var _field = {
    writable: true,
    value: 1
};

import * as swcHelpers from "@swc/helpers";
// @target: esnext, es2022, es2015
// @useDefineForClassFields: false
class A {
    testObject() {
        return {
            x: 10,
            y: 6
        };
    }
    testArray() {
        return [
            10,
            11
        ];
    }
    static test(_a) {
        [swcHelpers.classStaticPrivateFieldDestructureSet(_a, A, _field).value] = [
            2
        ];
    }
    constructor(){
        this.otherClass = A;
        let y;
        ({ x: swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value , y  } = this.testObject());
        [swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value, y] = this.testArray();
        ({ a: swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value , b: [swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value]  } = {
            a: 1,
            b: [
                2
            ]
        });
        [swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value, [swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value]] = [
            1,
            [
                2
            ]
        ];
        ({ a: swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = 1 , b: [swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = 1]  } = {
            b: []
        });
        [swcHelpers.classStaticPrivateFieldDestructureSet(A, A, _field).value = 2] = [];
        [swcHelpers.classStaticPrivateFieldDestructureSet(this.otherClass, A, _field).value = 2] = [];
    }
}
var _field = {
    writable: true,
    value: 1
};

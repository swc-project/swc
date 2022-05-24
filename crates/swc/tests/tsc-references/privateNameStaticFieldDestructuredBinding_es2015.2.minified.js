import _class_static_private_field_destructure from "@swc/helpers/lib/_class_static_private_field_destructure.js";
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
        [_class_static_private_field_destructure(_a, A, _field).value] = [
            2
        ];
    }
    constructor(){
        this.otherClass = A;
        let y;
        ({ x: _class_static_private_field_destructure(A, A, _field).value , y  } = this.testObject()), [_class_static_private_field_destructure(A, A, _field).value, y] = this.testArray(), ({ a: _class_static_private_field_destructure(A, A, _field).value , b: [_class_static_private_field_destructure(A, A, _field).value]  } = {
            a: 1,
            b: [
                2
            ]
        }), [_class_static_private_field_destructure(A, A, _field).value, [_class_static_private_field_destructure(A, A, _field).value]] = [
            1,
            [
                2
            ]
        ], ({ a: _class_static_private_field_destructure(A, A, _field).value = 1 , b: [_class_static_private_field_destructure(A, A, _field).value = 1]  } = {
            b: []
        }), [_class_static_private_field_destructure(A, A, _field).value = 2] = [], [_class_static_private_field_destructure(this.otherClass, A, _field).value = 2] = [];
    }
}
var _field = {
    writable: !0,
    value: 1
};

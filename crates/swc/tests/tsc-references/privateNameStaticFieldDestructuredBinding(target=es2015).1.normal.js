//// [privateNameStaticFieldDestructuredBinding.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
var _field = new WeakMap();
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
        [_class_private_field_get(_a, _field)] = [
            2
        ];
    }
    constructor(){
        this.otherClass = A;
        let y;
        ({ x: _class_private_field_get(A, _field), y } = this.testObject());
        [_class_private_field_get(A, _field), y] = this.testArray();
        ({ a: _class_private_field_get(A, _field), b: [_class_private_field_get(A, _field)] } = {
            a: 1,
            b: [
                2
            ]
        });
        [_class_private_field_get(A, _field), [_class_private_field_get(A, _field)]] = [
            1,
            [
                2
            ]
        ];
        ({ a: _class_private_field_get(A, _field) = 1, b: [_class_private_field_get(A, _field) = 1] } = {
            b: []
        });
        [_class_private_field_get(A, _field) = 2] = [];
        [_class_private_field_get(this.otherClass, _field) = 2] = [];
    }
}
_field.set(A, {
    writable: true,
    value: 1
});

//// [privateNameFieldDestructuredBinding.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_destructure from "@swc/helpers/src/_class_private_field_destructure.mjs";
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
        [_class_private_field_destructure(_a, _field).value] = [
            2
        ];
    }
    constructor(){
        _class_private_field_init(this, _field, {
            writable: !0,
            value: 1
        }), this.otherObject = new A();
        let y;
        ({ x: _class_private_field_destructure(this, _field).value , y  } = this.testObject()), [_class_private_field_destructure(this, _field).value, y] = this.testArray(), ({ a: _class_private_field_destructure(this, _field).value , b: [_class_private_field_destructure(this, _field).value]  } = {
            a: 1,
            b: [
                2
            ]
        }), [_class_private_field_destructure(this, _field).value, [_class_private_field_destructure(this, _field).value]] = [
            1,
            [
                2
            ]
        ], ({ a: _class_private_field_destructure(this, _field).value = 1 , b: [_class_private_field_destructure(this, _field).value = 1]  } = {
            b: []
        }), [_class_private_field_destructure(this, _field).value = 2] = [], [_class_private_field_destructure(this.otherObject, _field).value = 2] = [];
    }
}

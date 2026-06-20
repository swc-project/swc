import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _x = /*#__PURE__*/ new WeakMap();
class Foo {
    constructor(o){
        _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        });
        _x.has(o);
    }
}
var _y = /*#__PURE__*/ new WeakMap();
class Bar extends Foo {
    constructor(...args){
        super(...args), _class_private_field_init(this, _y, {
            writable: true,
            value: void 0
        }), _class_private_field_set(this, _y, null);
    }
}
new Foo({});

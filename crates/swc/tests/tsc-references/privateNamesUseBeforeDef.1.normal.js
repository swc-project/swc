//// [privateNamesUseBeforeDef.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _foo = new WeakMap(), _bar = new WeakMap(), _foo1 = new WeakMap(), _bar1 = new WeakSet(), _foo2 = new WeakMap(), _bar2 = new WeakMap(), _foo3 = new WeakMap(), _bar3 = new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: void 0
        }); // Error
        _class_private_field_init(this, _bar, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _foo, _class_private_field_get(this, _bar));
        _class_private_field_set(this, _bar, 3);
    }
}
class A2 {
    constructor(){
        _bar1.add(this);
        _class_private_field_init(this, _foo1, {
            writable: true,
            value: void 0
        }); // No Error
        _class_private_field_set(this, _foo1, bar.call(this));
    }
}
class A3 {
    constructor(){
        var _this;
        _bar2.set(this, {
            get: get_bar,
            set: void 0
        });
        _class_private_field_init(this, _foo2, {
            writable: true,
            value: void 0
        }); // No Error
        _class_private_field_set(this, _foo2, (_this = this, _bar2.get(_this).get.call(_this)));
    }
}
class B {
    constructor(){
        _class_private_field_init(this, _foo3, {
            writable: true,
            value: void 0
        }); // Error
        _class_private_field_init(this, _bar3, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _foo3, _class_private_field_get(this, _bar3));
        _class_private_field_set(this, _bar3, _class_private_field_get(this, _foo3));
    }
}

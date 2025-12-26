//// [privateNameWhenNotUseDefineForClassFieldsInEsNext.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _foo = new WeakMap(), __ = new WeakMap(), Inner, _prop = new WeakMap(), __1 = new WeakMap(), __2 = new WeakMap(), _prop1 = new WeakMap();
class TestWithStatics {
    constructor(){
        _class_private_field_init(this, _prop, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _prop, 0);
    }
}
class TestNonStatics {
    constructor(){
        _class_private_field_init(this, _prop1, {
            writable: true,
            value: void 0
        });
        var _foo = new WeakMap();
        _class_private_field_set(this, _prop1, 0);
        this.dd = _class_private_field_get(new TestNonStatics(), _prop1); // OK
        this["X_ z_ zz"] = class Inner {
            m() {
                new TestNonStatics().#prop; // Ok
            }
            static M() {
                return class {
                    m() {
                        new TestNonStatics().#prop; // OK
                        new Inner().#foo; // OK
                    }
                };
            }
            constructor(){
                _class_private_field_init(this, _foo, {
                    writable: true,
                    value: void 0
                });
                _class_private_field_set(this, _foo, 10);
                this.C = class InnerInner {
                    m() {
                        new TestNonStatics().#prop; // Ok
                        new Inner().#foo; // Ok
                    }
                };
            }
        };
    }
}

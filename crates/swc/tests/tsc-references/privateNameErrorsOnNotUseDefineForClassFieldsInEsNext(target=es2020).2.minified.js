//// [privateNameErrorsOnNotUseDefineForClassFieldsInEsNext.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _foo, _Inner, _foo1, _prop = new WeakMap();
class TestWithErrors {
    constructor(){
        _class_private_field_init(this, _prop, {
            writable: !0,
            value: 0
        });
    }
}
TestWithErrors.dd = _class_private_field_get(new TestWithErrors(), _prop), TestWithErrors["X_ z_ zz"] = (_foo = new WeakMap(), _Inner = class Inner {
    m() {
        _class_private_field_get(new TestWithErrors(), _prop);
    }
    static M() {
        return class {
            m() {
                _class_private_field_get(new TestWithErrors(), _prop), _class_private_field_get(new Inner(), _foo);
            }
        };
    }
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: !0,
            value: 10
        });
    }
}, _Inner.C = class {
    m() {
        _class_private_field_get(new TestWithErrors(), _prop), _class_private_field_get(new _Inner(), _foo);
    }
}, _Inner);
var _prop1 = new WeakMap();
class TestNoErrors {
    constructor(){
        _class_private_field_init(this, _prop1, {
            writable: !0,
            value: 0
        }), this.dd = _class_private_field_get(new TestNoErrors(), _prop1), this["X_ z_ zz"] = (_foo1 = new WeakMap(), class Inner {
            m() {
                _class_private_field_get(new TestNoErrors(), _prop1);
            }
            static M() {
                return class {
                    m() {
                        _class_private_field_get(new TestNoErrors(), _prop1), _class_private_field_get(new Inner(), _foo1);
                    }
                };
            }
            constructor(){
                _class_private_field_init(this, _foo1, {
                    writable: !0,
                    value: 10
                }), this.C = class {
                    m() {
                        _class_private_field_get(new TestNoErrors(), _prop1), _class_private_field_get(new Inner(), _foo1);
                    }
                };
            }
        });
    }
}

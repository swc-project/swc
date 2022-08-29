//// [privateNameWhenNotUseDefineForClassFieldsInEsNext.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _foo, _Inner, _foo1;
var _prop = /*#__PURE__*/ new WeakMap(), _ref;
class TestWithStatics {
    constructor(){
        _class_private_field_init(this, _prop, {
            writable: true,
            value: 0
        });
    }
}
TestWithStatics.dd = _class_private_field_get(_ref = new TestWithStatics(), _prop) // OK
;
TestWithStatics["X_ z_ zz"] = (_foo = /*#__PURE__*/ new WeakMap(), _Inner = class Inner {
    m() {
        var _ref;
        _class_private_field_get(_ref = new TestWithStatics(), _prop // OK
        );
    }
    static M() {
        return class {
            m() {
                var _ref, _ref1;
                _class_private_field_get(_ref = new TestWithStatics(), _prop // OK
                );
                _class_private_field_get(_ref1 = new Inner(), _foo); // OK
            }
        };
    }
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: 10
        });
    }
}, _Inner.C = class InnerInner {
    m() {
        var _ref, _ref1;
        _class_private_field_get(_ref = new TestWithStatics(), _prop // OK
        );
        _class_private_field_get(_ref1 = new _Inner(), _foo); // OK
    }
}, _Inner);
var _prop1 = /*#__PURE__*/ new WeakMap(), _ref1;
class TestNonStatics {
    constructor(){
        _class_private_field_init(this, _prop1, {
            writable: true,
            value: 0
        });
        this.dd = _class_private_field_get(_ref1 = new TestNonStatics(), _prop1) // OK
        ;
        this["X_ z_ zz"] = (_foo1 = /*#__PURE__*/ new WeakMap(), class Inner {
            m() {
                var _ref;
                _class_private_field_get(_ref = new TestNonStatics(), _prop1 // Ok
                );
            }
            static M() {
                return class {
                    m() {
                        var _ref, _ref1;
                        _class_private_field_get(_ref = new TestNonStatics(), _prop1 // OK
                        );
                        _class_private_field_get(_ref1 = new Inner(), _foo1); // OK
                    }
                };
            }
            constructor(){
                _class_private_field_init(this, _foo1, {
                    writable: true,
                    value: 10
                });
                this.C = class InnerInner {
                    m() {
                        var _ref, _ref1;
                        _class_private_field_get(_ref = new TestNonStatics(), _prop1 // Ok
                        );
                        _class_private_field_get(_ref1 = new Inner(), _foo1); // Ok
                    }
                };
            }
        });
    }
}

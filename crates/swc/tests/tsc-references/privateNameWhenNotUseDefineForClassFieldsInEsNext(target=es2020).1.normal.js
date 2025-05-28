//// [privateNameWhenNotUseDefineForClassFieldsInEsNext.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _foo, _Inner;
var _prop = /*#__PURE__*/ new WeakMap(), _ref;
class TestWithStatics {
    constructor(){
        _class_private_field_init(this, _prop, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _prop, 0);
    }
}
TestWithStatics.dd = _class_private_field_get(_ref = new TestWithStatics(), _prop); // OK
TestWithStatics["X_ z_ zz"] = (_foo = /*#__PURE__*/ new WeakMap(), _Inner = class Inner {
    m() {
        var _ref;
        _class_private_field_get(_ref = new TestWithStatics(), _prop); // OK
    }
    static M() {
        return class {
            m() {
                var _ref, _ref1;
                _class_private_field_get(_ref = new TestWithStatics(), _prop); // OK
                _class_private_field_get(_ref1 = new Inner(), _foo); // OK
            }
        };
    }
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _foo, 10);
    }
}, _Inner.C = class InnerInner {
    m() {
        var _ref, _ref1;
        _class_private_field_get(_ref = new TestWithStatics(), _prop); // OK
        _class_private_field_get(_ref1 = new _Inner(), _foo); // OK
    }
}, _Inner);
var _prop1 = /*#__PURE__*/ new WeakMap();
class TestNonStatics {
    constructor(){
        var _ref;
        _class_private_field_init(this, _prop1, {
            writable: true,
            value: void 0
        });
        var _foo;
        _class_private_field_set(this, _prop1, 0);
        this.dd = _class_private_field_get(_ref = new TestNonStatics(), _prop1); // OK
        this["X_ z_ zz"] = (_foo = /*#__PURE__*/ new WeakMap(), class Inner {
            m() {
                var _ref;
                _class_private_field_get(_ref = new TestNonStatics(), _prop1); // Ok
            }
            static M() {
                return class {
                    m() {
                        var _ref, _ref1;
                        _class_private_field_get(_ref = new TestNonStatics(), _prop1); // OK
                        _class_private_field_get(_ref1 = new Inner(), _foo); // OK
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
                        var _ref, _ref1;
                        _class_private_field_get(_ref = new TestNonStatics(), _prop1); // Ok
                        _class_private_field_get(_ref1 = new Inner(), _foo); // Ok
                    }
                };
            }
        });
    }
}

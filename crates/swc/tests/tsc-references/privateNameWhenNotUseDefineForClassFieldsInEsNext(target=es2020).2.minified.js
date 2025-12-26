//// [privateNameWhenNotUseDefineForClassFieldsInEsNext.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _foo, _Inner, _prop = /*#__PURE__*/ new WeakMap();
class TestWithStatics {
    constructor(){
        _class_private_field_init(this, _prop, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _prop, 0);
    }
}
TestWithStatics.dd = _class_private_field_get(new TestWithStatics(), _prop), TestWithStatics["X_ z_ zz"] = (_foo = /*#__PURE__*/ new WeakMap(), (_Inner = class Inner {
    m() {
        _class_private_field_get(new TestWithStatics(), _prop);
    }
    static M() {
        return class {
            m() {
                _class_private_field_get(new TestWithStatics(), _prop), _class_private_field_get(new Inner(), _foo);
            }
        };
    }
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _foo, 10);
    }
}).C = class {
    m() {
        _class_private_field_get(new TestWithStatics(), _prop), _class_private_field_get(new _Inner(), _foo);
    }
}, _Inner);

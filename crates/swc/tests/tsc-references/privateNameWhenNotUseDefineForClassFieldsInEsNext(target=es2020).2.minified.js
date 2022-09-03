//// [privateNameWhenNotUseDefineForClassFieldsInEsNext.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _foo, _Inner, _prop = new WeakMap();
class TestWithStatics {
    constructor(){
        _class_private_field_init(this, _prop, {
            writable: !0,
            value: 0
        });
    }
}
TestWithStatics.dd = _class_private_field_get(new TestWithStatics(), _prop), TestWithStatics["X_ z_ zz"] = (_foo = new WeakMap(), (_Inner = class Inner {
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
            value: 10
        });
    }
}).C = class {
    m() {
        _class_private_field_get(new TestWithStatics(), _prop), _class_private_field_get(new _Inner(), _foo);
    }
}, _Inner);

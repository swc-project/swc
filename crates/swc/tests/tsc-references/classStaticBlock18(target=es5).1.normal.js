//// [classStaticBlock18.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function foo() {
    var _this = this;
    var __ = new WeakMap(), __2 = new WeakMap(), _class;
    return _class = function _class() {
        "use strict";
        _class_call_check(this, _class);
    }, __.set(_class, {
        writable: true,
        value: this.foo = 1
    }), __2.set(_class, {
        writable: true,
        value: function() {
            var __ = new WeakMap(), _class;
            var c = (_class = function _class() {
                "use strict";
                _class_call_check(this, _class);
            }, __.set(_class, {
                writable: true,
                value: _this.bar = 2
            }), _class);
        }()
    }), _class;
}

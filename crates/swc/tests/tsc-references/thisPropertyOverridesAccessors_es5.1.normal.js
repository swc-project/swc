// @target: esnext
// @allowjs: true
// @noemit: true
// @checkjs: true
// @Filename: foo.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    _create_class(Foo, [
        {
            key: "p",
            get: function get() {
                return 1;
            },
            set: function set(value) {}
        }
    ]);
    return Foo;
}();
// @Filename: bar.js
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Bar = /*#__PURE__*/ function(Foo1) {
    "use strict";
    _inherits(Bar, Foo1);
    var _super = _create_super(Bar);
    function Bar() {
        _class_call_check(this, Bar);
        var _this;
        _this = _super.call(this);
        _this.p = 2;
        return _this;
    }
    return Bar;
}(Foo);

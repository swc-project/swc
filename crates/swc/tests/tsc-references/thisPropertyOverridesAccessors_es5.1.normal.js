import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @target: esnext
// @allowjs: true
// @noemit: true
// @checkjs: true
// @Filename: foo.ts
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
var Bar = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar, Foo);
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

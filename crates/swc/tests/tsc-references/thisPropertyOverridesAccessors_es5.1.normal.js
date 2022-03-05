import * as swcHelpers from "@swc/helpers";
var Foo = // @target: esnext
// @allowjs: true
// @noemit: true
// @checkjs: true
// @Filename: foo.ts
/*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    swcHelpers.createClass(Foo, [
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
var Bar = // @Filename: bar.js
/*#__PURE__*/ function(Foo) {
    "use strict";
    swcHelpers.inherits(Bar, Foo);
    var _super = swcHelpers.createSuper(Bar);
    function Bar() {
        swcHelpers.classCallCheck(this, Bar);
        var _this;
        _this = _super.call(this);
        _this.p = 2;
        return _this;
    }
    return Bar;
}(Foo);

import * as swcHelpers from "@swc/helpers";
var _this = this;
var B = // @noEmit: true
// @checkJs: true
// @allowJs: true
// @Filename: a.js
/*#__PURE__*/ function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B);
        this.n = 1;
    }
    swcHelpers.createClass(B, [
        {
            key: "foo",
            value: function foo() {}
        }
    ]);
    return B;
}();
var C = /*#__PURE__*/ function(B) {
    "use strict";
    swcHelpers.inherits(C, B);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
// this override should be fine (even if it's a little odd)
C.prototype.foo = function() {};
var D = /*#__PURE__*/ function(B) {
    "use strict";
    swcHelpers.inherits(D, B);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(B);
D.prototype.foo = function() {
    _this.n = 'not checked, so no error';
};
var Module = function Module() {
    "use strict";
    swcHelpers.classCallCheck(this, Module);
};
Module.prototype.identifier = undefined;
Module.prototype.size = null;
var NormalModule = /*#__PURE__*/ function(Module) {
    "use strict";
    swcHelpers.inherits(NormalModule, Module);
    var _super = swcHelpers.createSuper(NormalModule);
    function NormalModule() {
        swcHelpers.classCallCheck(this, NormalModule);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(NormalModule, [
        {
            key: "identifier",
            value: function identifier() {
                return 'normal';
            }
        },
        {
            key: "size",
            value: function size() {
                return 0;
            }
        }
    ]);
    return NormalModule;
}(Module);

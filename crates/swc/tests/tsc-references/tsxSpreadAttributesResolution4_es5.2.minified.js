import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var j, _this = this, React = require("react"), Poisoned = function(_Component) {
    "use strict";
    _inherits(Poisoned, _Component);
    var _super = _create_super(Poisoned);
    function Poisoned() {
        return _class_call_check(this, Poisoned), _super.apply(this, arguments);
    }
    return Poisoned.prototype.render = function() {
        return React.createElement("div", null, "Hello");
    }, Poisoned;
}(React.Component);
_extends({}, {
    x: "hello world",
    y: 2
});
var EmptyProp = function(_Component) {
    "use strict";
    _inherits(EmptyProp, _Component);
    var _super = _create_super(EmptyProp);
    function EmptyProp() {
        return _class_call_check(this, EmptyProp), _super.apply(this, arguments);
    }
    return EmptyProp.prototype.render = function() {
        return React.createElement("div", null, "Default hi");
    }, EmptyProp;
}(React.Component);
_extends({}, {}), _extends({}, j), _extends({}, {
    ref: function(input) {
        _this.textInput = input;
    }
}), _extends({}, {
    "data-prop": !0
});

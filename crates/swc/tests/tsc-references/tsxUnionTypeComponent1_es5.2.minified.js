import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var React = require("react"), MyComponent = function(_Component) {
    "use strict";
    _inherits(MyComponent, _Component);
    var _super = _create_super(MyComponent);
    function MyComponent() {
        return _class_call_check(this, MyComponent), _super.apply(this, arguments);
    }
    return MyComponent.prototype.render = function() {
        var AnyComponent = this.props.AnyComponent;
        return React.createElement(AnyComponent, null);
    }, MyComponent;
}(React.Component), MyButtonComponent = function(_Component) {
    "use strict";
    _inherits(MyButtonComponent, _Component);
    var _super = _create_super(MyButtonComponent);
    function MyButtonComponent() {
        return _class_call_check(this, MyButtonComponent), _super.apply(this, arguments);
    }
    return MyButtonComponent;
}(React.Component);

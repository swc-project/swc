import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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

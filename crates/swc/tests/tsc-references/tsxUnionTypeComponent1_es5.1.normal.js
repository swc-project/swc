import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @filename: file.tsx
// @jsx: react
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
var MyComponent = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(MyComponent, _Component);
    var _super = _create_super(MyComponent);
    function MyComponent() {
        _class_call_check(this, MyComponent);
        return _super.apply(this, arguments);
    }
    var _proto = MyComponent.prototype;
    _proto.render = function render() {
        var AnyComponent = this.props.AnyComponent;
        return /*#__PURE__*/ React.createElement(AnyComponent, null);
    };
    return MyComponent;
}(React.Component);
// Stateless Component As Props
/*#__PURE__*/ React.createElement(MyComponent, {
    AnyComponent: function() {
        return /*#__PURE__*/ React.createElement("button", null, "test");
    }
});
// Component Class as Props
var MyButtonComponent = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(MyButtonComponent, _Component);
    var _super = _create_super(MyButtonComponent);
    function MyButtonComponent() {
        _class_call_check(this, MyButtonComponent);
        return _super.apply(this, arguments);
    }
    return MyButtonComponent;
}(React.Component);
/*#__PURE__*/ React.createElement(MyComponent, {
    AnyComponent: MyButtonComponent
});
export { };

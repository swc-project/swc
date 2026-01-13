//// [file.tsx]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var MyComponent = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(MyComponent, _React_Component);
    function MyComponent() {
        _class_call_check(this, MyComponent);
        return _call_super(this, MyComponent, arguments);
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
var MyButtonComponent = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(MyButtonComponent, _React_Component);
    function MyButtonComponent() {
        _class_call_check(this, MyButtonComponent);
        return _call_super(this, MyButtonComponent, arguments);
    }
    return MyButtonComponent;
}(React.Component);
/*#__PURE__*/ React.createElement(MyComponent, {
    AnyComponent: MyButtonComponent
});
export { };

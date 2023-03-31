//// [tsxAttributeResolution11.tsx]
define([
    "require"
], function(require) {
    "use strict";
});
//// [react.d.ts]
define([
    "require"
], function(require) {
    "use strict";
});
//// [file.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/src/_class_call_check.mjs"
], function(require, exports, _class_call_check) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _class_call_check = _class_call_check.default;
    var MyComponent = /*#__PURE__*/ function() {
        "use strict";
        function MyComponent() {
            _class_call_check(this, MyComponent);
        }
        var _proto = MyComponent.prototype;
        _proto.render = function render() {};
        return MyComponent;
    }();
    // Should be an OK
    var x = /*#__PURE__*/ React.createElement(MyComponent, {
        bar: "world"
    });
});

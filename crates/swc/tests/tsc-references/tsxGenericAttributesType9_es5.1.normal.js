import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _extends from "@swc/helpers/lib/_extends.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
export function makeP(Ctor) {
    return /*#__PURE__*/ function(_PureComponent) {
        "use strict";
        _inherits(_class, _PureComponent);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
            return _super.apply(this, arguments);
        }
        var _proto = _class.prototype;
        _proto.render = function render() {
            return /*#__PURE__*/ React.createElement(Ctor, _extends({}, this.props));
        };
        return _class;
    }(React.PureComponent);
}

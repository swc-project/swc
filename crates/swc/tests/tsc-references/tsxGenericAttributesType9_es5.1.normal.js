import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
export function makeP(Ctor) {
    return /*#__PURE__*/ (function(_PureComponent) {
        "use strict";
        swcHelpers.inherits(_class, _PureComponent);
        var _super = swcHelpers.createSuper(_class);
        function _class() {
            swcHelpers.classCallCheck(this, _class);
            return _super.apply(this, arguments);
        }
        var _proto = _class.prototype;
        _proto.render = function render() {
            return(/*#__PURE__*/ React.createElement(Ctor, swcHelpers.extends({}, this.props)));
        };
        return _class;
    })(React.PureComponent);
}

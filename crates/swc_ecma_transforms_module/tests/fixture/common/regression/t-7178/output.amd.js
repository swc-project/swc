define([
    "require",
    "exports",
    "props"
], function(require, exports, _props) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _props = /*#__PURE__*/ _interop_require_default(_props);
    console.log(_props.default);
    (function() {
        const { ...props } = this.props;
        console.log(props);
    })();
});

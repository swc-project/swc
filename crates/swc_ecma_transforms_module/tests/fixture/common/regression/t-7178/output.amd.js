define([
    "require",
    "exports",
    "props"
], function(require, exports, _props) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _props = _interopRequireDefault(_props);
    console.log(_props.default);
    (function() {
        const { ...props } = this.props;
        console.log(props);
    })();
});

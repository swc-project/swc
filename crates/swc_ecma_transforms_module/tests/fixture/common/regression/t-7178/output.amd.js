define([
    "require",
    "props"
], function(require, _props) {
    "use strict";
    _props = _interopRequireDefault(_props);
    console.log(_props.default);
    (function() {
        const { ...props } = this.props;
        console.log(props);
    })();
});

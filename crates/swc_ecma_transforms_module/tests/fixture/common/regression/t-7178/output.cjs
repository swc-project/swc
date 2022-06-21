"use strict";
var _props = _interopRequireDefault(require("props"));
console.log(_props.default);
(function() {
    const { ...props } = this.props;
    console.log(props);
})();

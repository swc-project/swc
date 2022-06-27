"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _props = _interopRequireDefault(require("props"));
console.log(_props.default);
(function() {
    const { ...props } = this.props;
    console.log(props);
})();

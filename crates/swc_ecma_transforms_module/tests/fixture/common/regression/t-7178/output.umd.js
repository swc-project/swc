(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("props"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "props"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.props);
})(this, function(_props) {
    "use strict";
    _props = _interopRequireDefault(_props);
    console.log(_props.default);
    (function() {
        const { ...props } = this.props;
        console.log(props);
    })();
});

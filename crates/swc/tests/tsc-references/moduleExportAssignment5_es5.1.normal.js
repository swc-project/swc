function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var Axios = // @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: axios.js
/*#__PURE__*/ function() {
    "use strict";
    function Axios() {
        _classCallCheck(this, Axios);
    }
    _createClass(Axios, [
        {
            key: "m",
            value: function m() {
            }
        }
    ]);
    return Axios;
}();
var axios = new Axios();
// none of the 3 references should have a use-before-def error
axios.m();
module.exports = axios;
module.exports.default = axios;

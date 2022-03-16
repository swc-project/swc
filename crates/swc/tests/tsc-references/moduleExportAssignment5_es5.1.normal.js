import * as swcHelpers from "@swc/helpers";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: axios.js
var Axios = /*#__PURE__*/ function() {
    "use strict";
    function Axios() {
        swcHelpers.classCallCheck(this, Axios);
    }
    var _proto = Axios.prototype;
    _proto.m = function m() {};
    return Axios;
}();
var axios = new Axios();
// none of the 3 references should have a use-before-def error
axios.m();
module.exports = axios;
module.exports.default = axios;

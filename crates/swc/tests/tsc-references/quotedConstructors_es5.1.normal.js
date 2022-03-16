import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
    console.log(this);
};
var D = function D() {
    "use strict";
    swcHelpers.classCallCheck(this, D);
    console.log(this);
};
var E = /*#__PURE__*/ function() {
    "use strict";
    function E() {
        swcHelpers.classCallCheck(this, E);
    }
    var _proto = E.prototype;
    _proto['constructor'] = function() {
        console.log(this);
    };
    return E;
}();
new function _class() {
    "use strict";
    swcHelpers.classCallCheck(this, _class);
    console.log(this);
};
var o = {
    "constructor": function() {}
};
var F = function F() {
    "use strict";
    swcHelpers.classCallCheck(this, F);
    console.log(this);
};

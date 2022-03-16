import * as swcHelpers from "@swc/helpers";
//type of 'this' in constructor param list is the class instance type (error)
var ErrClass = function ErrClass() {
    "use strict";
    var f = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this;
    swcHelpers.classCallCheck(this, ErrClass);
};

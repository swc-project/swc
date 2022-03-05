import * as swcHelpers from "@swc/helpers";
var Base = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
}, BaseFactory = function() {
    return new Base();
};
BaseFactory.Base = Base, module.exports = BaseFactory;

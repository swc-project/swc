import * as swcHelpers from "@swc/helpers";
var Base = function() {
    swcHelpers.classCallCheck(this, Base);
}, BaseFactory = function() {
    return new Base();
};
BaseFactory.Base = Base, module.exports = BaseFactory;

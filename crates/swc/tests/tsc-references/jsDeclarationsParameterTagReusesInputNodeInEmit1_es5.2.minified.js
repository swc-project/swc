import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var Base = function() {
    "use strict";
    _class_call_check(this, Base);
}, BaseFactory = function() {
    return new Base();
};
BaseFactory.Base = Base, module.exports = BaseFactory;

import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Base = function() {
    "use strict";
    _class_call_check(this, Base);
}, BaseFactory = function() {
    return new Base();
};
BaseFactory.Base = Base, module.exports = BaseFactory;

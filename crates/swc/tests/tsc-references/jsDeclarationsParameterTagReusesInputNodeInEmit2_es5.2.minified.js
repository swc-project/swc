var Base = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, Base);
}, BaseFactory = function() {
    return new Base();
};
BaseFactory.Base = Base, module.exports = BaseFactory;

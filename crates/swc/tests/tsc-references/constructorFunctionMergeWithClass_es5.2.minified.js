var SomeClass = function() {
    this.otherProp = 0;
};
new SomeClass();
var SomeClass = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, SomeClass);
};
SomeClass.prop = 0;

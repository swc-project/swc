var Foo = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, Foo), this.member = 10;
};
Foo.stat = 10, module.exports = new Foo();

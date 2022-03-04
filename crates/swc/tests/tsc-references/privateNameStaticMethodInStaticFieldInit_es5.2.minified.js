var C = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, C);
};
C.s = (function(receiver, classConstructor, method) {
    return (function(receiver, classConstructor) {
        if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
    })(receiver, classConstructor), method;
})(C, C, function() {
    return 42;
}).call(C), console.log(C.s);

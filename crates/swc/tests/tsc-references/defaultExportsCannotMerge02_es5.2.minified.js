import Entity from "m1";
var Decl = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, Decl);
};
Entity();
var z = new Entity();
z.p1 + z.p2;
export { Decl as default };

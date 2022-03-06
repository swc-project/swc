import Entity from "./m1";
var foo = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, foo);
};
export default function bar() {};
export default 10;
Entity();
export { foo as default };

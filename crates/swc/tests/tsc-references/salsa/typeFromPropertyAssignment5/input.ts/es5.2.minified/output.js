import MC from "./a";
export default function MyClass() {
};
MyClass.bar = function C() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, C);
};

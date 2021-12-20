export { x };
export { x as xx };
export default x;
var x = "x";
export { Y as Z };
var Y = function Y() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, Y);
};
export { y };
export { y as yy };
export default y;
var y = "y";

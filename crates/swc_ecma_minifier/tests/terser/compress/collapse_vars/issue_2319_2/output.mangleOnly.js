console.log((function(n) {
    "use strict";
    return n;
})(!(function() {
    return this;
})()));

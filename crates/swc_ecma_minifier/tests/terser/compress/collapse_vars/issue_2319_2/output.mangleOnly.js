console.log((function(a) {
    "use strict";
    return a;
})(!(function() {
    return this;
})()));

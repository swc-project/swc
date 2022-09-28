console.log(typeof (function() {
    return eval("this");
})());
console.log(typeof (function() {
    "use strict";
    return eval("this");
})());
console.log(typeof (function() {
    return (0, eval)("this");
})());
console.log(typeof (function() {
    "use strict";
    return (0, eval)("this");
})());

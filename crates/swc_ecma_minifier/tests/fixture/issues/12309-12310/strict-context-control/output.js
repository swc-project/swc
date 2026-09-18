(function() {
    "use strict";
    try {
        unresolved_strict_control = 1;
        console.log("no error");
    } catch (error) {
        console.log(error.name);
    }
})();

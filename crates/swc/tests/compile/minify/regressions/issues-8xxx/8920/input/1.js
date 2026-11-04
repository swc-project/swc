"use strict";
const k = (() => {
    function f() {
        class x { }
        x();
    }
    return f;
})();
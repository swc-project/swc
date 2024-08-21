"use strict";
let k = function() {
    function x() {}
    class y {
    }
    for (x of [
        ''
    ]);
    for(y in [
        ''
    ]);
}();

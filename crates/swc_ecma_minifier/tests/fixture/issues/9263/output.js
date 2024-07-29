"use strict";
const k = function() {
    for(var x in [
        4242
    ])break;
    return 42;
}();
export { k };

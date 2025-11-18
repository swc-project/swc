//// [folder/mod1.js]
define([
    "require"
], function(require) {
    "use strict";
    /**
 * @typedef {{x: number}} Item
 */ /**
 * @type {Item};
 */ var x = {
        x: 12
    };
    module.exports = x;
});
//// [index.js]
define([
    "require"
], function(require) {
    "use strict";
    /** @type {(typeof import("./folder/mod1"))[]} */ var items = [
        {
            x: 12
        }
    ];
    module.exports = items;
});

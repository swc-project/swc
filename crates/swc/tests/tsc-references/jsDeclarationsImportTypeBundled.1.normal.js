//// [folder/mod1.js]
/**
 * @typedef {{x: number}} Item
 */ /**
 * @type {Item};
 */ define([
    "require"
], function(require) {
    "use strict";
    var x = {
        x: 12
    };
    module.exports = x;
});
//// [index.js]
/** @type {(typeof import("./folder/mod1"))[]} */ define([
    "require"
], function(require) {
    "use strict";
    var items = [
        {
            x: 12
        }
    ];
    module.exports = items;
});

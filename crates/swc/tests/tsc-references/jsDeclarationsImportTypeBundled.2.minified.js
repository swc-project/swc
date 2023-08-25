//// [folder/mod1.js]
/**
 * @typedef {{x: number}} Item
 */ /**
 * @type {Item};
 */ define([
    "require"
], function(require) {
    module.exports = {
        x: 12
    };
});
//// [index.js]
/** @type {(typeof import("./folder/mod1"))[]} */ define([
    "require"
], function(require) {
    module.exports = [
        {
            x: 12
        }
    ];
});

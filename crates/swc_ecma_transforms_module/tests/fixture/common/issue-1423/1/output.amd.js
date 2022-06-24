define([
    "exports",
    "necessary"
], function(exports, _necessary) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    const { second  } = _necessary.arrayUtilities;
    const elements = [
        1,
        2,
        3
    ], secondElement = second(elements);
    console.log(secondElement);
});

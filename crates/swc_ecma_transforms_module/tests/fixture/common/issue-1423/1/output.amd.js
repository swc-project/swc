define([
    "require",
    "necessary"
], function(require, _necessary) {
    "use strict";
    const { second  } = _necessary.arrayUtilities;
    const elements = [
        1,
        2,
        3
    ], secondElement = second(elements);
    console.log(secondElement);
});

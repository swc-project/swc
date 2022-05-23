"use strict";
console.log(
    (function (a) {
        return !(function () {
            return this;
        })();
    })()
);

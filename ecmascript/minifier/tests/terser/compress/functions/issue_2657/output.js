"use strict";
console.log(
    (function (a) {
        return (b = a), b || b(), a;
        var b;
    })(42)
);

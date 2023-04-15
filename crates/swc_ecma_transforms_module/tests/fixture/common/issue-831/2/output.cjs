"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "myGenerator", {
    enumerable: true,
    get: function() {
        return myGenerator;
    }
});
function* myGenerator() {
    yield* [
        1,
        2,
        3
    ];
}

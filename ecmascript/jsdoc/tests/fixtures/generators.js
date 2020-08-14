'use strict';

/** Generate unique IDs starting at 0. */
function* startsAt0() {
    var index = 0;
    while (true) {
        yield index++;
    }
}

/** Generate unique IDs starting at 1. */
var startsAt1 = function* startsAt1() {
    var index = 1;
    while (true) {
        yield index++;
    }
};

/** Generator class. */
class Generator {
    /** Generate unique IDs starting at 2. */
    * startsAt2() {
        var index = 2;
        while (true) {
            yield index++;
        }
    }
}

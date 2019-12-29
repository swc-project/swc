if (a) {
    try {
        b('try');
    } catch (c) {
    }
    // do not optimize it
    (function() {
        b('d');
    }());
}

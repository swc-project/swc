if (a) {
    try {} catch (b) {}
    // do not optimize it
    (function() {
        c('d');
    }());
} else {
    try {} catch (b) {}
    // do not optimize it
    (function() {
        c('d');
    }());
}

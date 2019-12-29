try {
    // do not optimize it
    (function() {
        a('b');
    }());
} catch (c) {
    // do not optimize it
    (function() {
        a('b');
    }());
} finally{
    // do not optimize it
    (function() {
        a('b');
    }());
}

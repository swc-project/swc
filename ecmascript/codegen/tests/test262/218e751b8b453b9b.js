if (a) {
    // optimize it
    (function() {
        b('c');
    }());
    try {
        b("d");
    } catch (e) {
    }
}

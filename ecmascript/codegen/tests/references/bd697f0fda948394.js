(function() {
    try {
        throw 'a';
    } catch (b) {
    }
    c(); // This must not be removed.
}());

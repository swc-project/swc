!function() {
    try {} catch (e) {
        // hi
        baz();
        throw e;
    }
}();

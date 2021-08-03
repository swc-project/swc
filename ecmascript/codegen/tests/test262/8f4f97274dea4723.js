(function() {
    a: {
        break a;
        b(); // This should be removed.
    }
    c();
}());

(function() {
    if (a) {
        b();
        return 1;
    } else {
        b();
        return 2;
    }
    c();
}());

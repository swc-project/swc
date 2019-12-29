(function() {
    try {
        throw 'a';
    } finally{
        b();
    }
    c(); // This should be removed.
}());

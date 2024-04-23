(function() {
    try {
        throw 'a';
    } catch (b) {} finally{
        return 1;
    }
    c(); // This should be removed.
}());

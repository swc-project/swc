(function() {
    throw 'a';
    with (b); // This should be removed.
}());

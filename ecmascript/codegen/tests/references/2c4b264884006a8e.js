(function() {
    throw 'a';
    with (b); // This should be removed.

     // This should be removed.

}());

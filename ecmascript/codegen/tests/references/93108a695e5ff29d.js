(function() {
    var a;
    if (b) return;
    /* I would
                              insert something
                              there, but I'm sort
                              of lazy so whatever.
  */ a = new c();
    return a;
})()(function() {
    var a;
    if (b) return;
    /* I would insert something there, */ /*
                             but I'm sort of lazy so
  */ /*                      whatever. */ a = new c();
    return a;
})()(function() {
    var a;
    if (b) return; // I would insert something there, but I'm sort of lazy so whatever.
    a = new c();
    return a;
})();

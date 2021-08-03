(function() {
    // https://github.com/Constellation/esmangle/issues/65
    var a = 1;
    var b = 2;
    var c = 3;
    var d = [].e.f(arguments);
    return [
        a,
        b,
        c,
        g
    ];
}());

(function() {
    var a = {
    };
    a.b + (c(), d(), e()); // do not transform
}());

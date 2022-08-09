function r() {
    var r = pure(1);
    var a = pure(2);
    var v = pure(a);
    var n = pure(pure(side_effects()));
    return pure(3);
}

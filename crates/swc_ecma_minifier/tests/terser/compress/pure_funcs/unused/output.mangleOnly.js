function r() {
    var r = pure(1);
    var e = pure(2);
    var u = pure(e);
    var p = pure(pure(side_effects()));
    return pure(3);
}

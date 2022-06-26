function a() {
    var a = pure(1);
    var b = pure(2);
    var c = pure(b);
    var d = pure(pure(side_effects()));
    return pure(3);
}

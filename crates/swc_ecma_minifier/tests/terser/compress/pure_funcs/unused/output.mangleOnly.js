function a() {
    var b = pure(1);
    var a = pure(2);
    var c = pure(a);
    var d = pure(pure(side_effects()));
    return pure(3);
}

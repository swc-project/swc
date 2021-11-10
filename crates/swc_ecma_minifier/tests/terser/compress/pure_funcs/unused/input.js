function foo() {
    var u = pure(1);
    var x = pure(2);
    var y = pure(x);
    var z = pure(pure(side_effects()));
    return pure(3);
}

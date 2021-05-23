function foo(rot) {
    return (rot < -5 || rot > 5) && bar(), void baz();
}

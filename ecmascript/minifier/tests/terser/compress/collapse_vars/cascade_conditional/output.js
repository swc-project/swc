function f(a, b) {
    (a = x()) ? a++ : (b = y(a))(a);
}

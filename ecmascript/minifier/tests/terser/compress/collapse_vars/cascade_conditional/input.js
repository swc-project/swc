function f(a, b) {
    ((a = x()), a) ? a++ : ((b = y(a)), b(a));
}

function f(f, o) {
    "foo" ^ (o += f),
        o ? false : (o = f) ? -1 : (o -= f) - (o ^= f),
        f-- || !f,
        f;
}

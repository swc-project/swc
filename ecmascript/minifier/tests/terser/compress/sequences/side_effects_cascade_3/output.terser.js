function f(a, b) {
    !(b += a) && ((b = a) || ((b -= a), (b ^= a))), a--;
}

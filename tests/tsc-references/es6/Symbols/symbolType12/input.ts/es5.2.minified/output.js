var s = Symbol.for("assign"), str = "";
s *= s, s /= s *= 0, s %= s /= 0, s += s %= 0, s += 0, str += s += "", s -= s, s -= 0, s <<= s, s <<= 0, s >>= s, s >>= 0, s >>>= s, s >>>= 0, s &= s, s &= 0, s ^= s, s ^= 0, s |= s, s |= 0, str += s || str;

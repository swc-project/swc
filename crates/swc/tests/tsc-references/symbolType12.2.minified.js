//// [symbolType12.ts]
var s = Symbol.for("assign"), str = "";
s *= 0, s /= s, s /= 0, s %= s, s %= 0, str += s = s + 0 + "", s -= 0, s <<= s, s <<= 0, s >>= s, s >>= 0, s >>>= s, s >>>= 0, s &= s, s &= 0, s ^= s, s ^= 0, s |= s, s |= 0, str += s || str;

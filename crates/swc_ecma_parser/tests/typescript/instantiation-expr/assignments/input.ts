// The checker rejects these assignment targets, but the parser must retain
// the instantiation expressions rather than reinterpret their angle brackets.
f<T> = other;
f<T> += other;
f<T> -= other;
f<T> *= other;
f<T> %= other;
f<T> **= other;
f<T> <<= other;
f<T> |= other;
f<T> &= other;
f<T> ^= other;
f<T> &&= other;
f<T> ||= other;
f<T> ??= other;
f<T> += g<U> *= other;
f<Foo<Bar<T>>> += other;
factory().method<T> += other;
object["method"]<T> += other;
(f<T>) /= other;
(f<T>) >>= other;
(f<T>) >>>= other;
f<T>
/= other;
f<T> /= pattern/;

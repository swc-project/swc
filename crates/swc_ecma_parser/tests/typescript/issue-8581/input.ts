function fun<V>(func: V) {
    return func;
}

fun<<V>(key: V) => V>(<A>(x: A) => x)

fun<
    <V>(key2: V) => V>(<A>(x: A) => x)
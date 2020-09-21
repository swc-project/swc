// Positive repro from #17166
function f3<T, K extends Extract<keyof T, string>>(t: T, k: K, tk: T[K]): void {
    for (let key in t) {
        key = k; // ok, K ==> keyof T
        t[key] = tk; // ok, T[K] ==> T[keyof T]
    }
}

// # 21185
type Predicates<TaggedRecord> = {
    [T in keyof TaggedRecord]: (variant: TaggedRecord[keyof TaggedRecord]) => variant is TaggedRecord[T]
}

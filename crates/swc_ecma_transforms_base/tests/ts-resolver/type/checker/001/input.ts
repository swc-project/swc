const assign =
    <T, K1 extends keyof T, K2 extends keyof T[K1]>(
        object: T,
        key1: K1,
        key2: K2
    ) =>
    (value: T[K1][K2]) =>
        (object[key1][key2] = value);

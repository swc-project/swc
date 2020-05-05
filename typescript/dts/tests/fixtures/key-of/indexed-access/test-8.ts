// Repro from #21770

type Dict<T extends string> = { [key in T]: number };
type DictDict<V extends string, T extends string> = { [key in V]: Dict<T> };

function ff1<V extends string, T extends string>(dd: DictDict<V, T>, k1: V, k2: T): number {
    return dd[k1][k2];
}

function ff2<V extends string, T extends string>(dd: DictDict<V, T>, k1: V, k2: T): number {
    const d: Dict<T> = dd[k1];
    return d[k2];
}


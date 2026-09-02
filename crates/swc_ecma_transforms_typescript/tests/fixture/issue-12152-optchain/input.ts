enum E {
    A = 1,
}
const direct = E?.A;
enum FromDirect {
    X = direct,
    Y,
}
const computed = E?.["A"];
enum FromComputed {
    X = computed,
    Y,
}
const nested = E?.A?.valueOf;
enum FromNested {
    X = nested,
    Y,
}

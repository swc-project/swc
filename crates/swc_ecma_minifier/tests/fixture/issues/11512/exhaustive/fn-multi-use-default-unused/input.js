function id(a, b = 1) {
    return a;
}

export function fnMultiUseDefaultUnused(value) {
    return id(value) + id(value + 1);
}

function keep(a, b = a) {
    return a;
}

export function fnMultiUseDefaultRefPrev(value) {
    return keep(value) + keep(value + 1);
}

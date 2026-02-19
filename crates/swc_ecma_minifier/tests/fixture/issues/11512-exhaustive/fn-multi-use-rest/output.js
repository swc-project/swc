function keep(a, b = 1, ...rest) {
    return a + rest.length;
}
export function fnMultiUseRest(value) {
    return keep(value) + keep(value + 1, 2, 3);
}

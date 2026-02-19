function add(a, b = 1) {
    return a + b;
}
export function fnMultiUseDefaultUsed(value) {
    return add(value) + add(value + 1);
}

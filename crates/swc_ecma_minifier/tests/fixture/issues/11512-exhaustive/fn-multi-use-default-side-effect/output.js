let sideCalls = 0;
function keep(a, b = (sideCalls++, 1)) {
    return a;
}
export function fnMultiUseDefaultSideEffect(value) {
    return keep(value) + keep(value + 1);
}

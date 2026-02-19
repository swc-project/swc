let sideCalls = 0;

function side() {
    sideCalls++;
    return 1;
}

function keep(a, b = side()) {
    return a;
}

export function fnMultiUseDefaultSideEffect(value) {
    return keep(value) + keep(value + 1);
}

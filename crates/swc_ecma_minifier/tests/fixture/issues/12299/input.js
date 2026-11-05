function f(x) {
    try {
        if (x) throw 1;
    } finally {
        return 2;
    }
    return 2;
}

function finalizerOverridesReturn() {
    try {
        return 1;
    } finally {
        return 2;
    }
    return 2;
}

function duplicateReturn(x) {
    if (x) return 2;
    return 2;
}

console.log(f(false));
console.log(f(true));
console.log(finalizerOverridesReturn());
console.log(duplicateReturn(false));
console.log(duplicateReturn(true));

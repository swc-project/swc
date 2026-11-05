function f(x) {
    try {
        if (x) throw 1;
    } finally{
        return 2;
    }
    return 2;
}
function finalizerOverridesReturn() {
    try {
        return 1;
    } finally{
        return 2;
    }
}
function duplicateReturn(x) {
    return 2;
}
console.log(f(!1)), console.log(f(!0)), console.log(finalizerOverridesReturn()), console.log(duplicateReturn(!1)), console.log(duplicateReturn(!0));

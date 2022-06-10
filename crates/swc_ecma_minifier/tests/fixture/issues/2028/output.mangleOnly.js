function b(a) {
    return a != null;
}
function a(a, c) {
    if (a == null || b(a)) {
        return true;
    }
    return false;
}
module.exports = a;

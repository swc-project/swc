function a(a) {
    return a != null;
}
function b(b, c) {
    if (b == null || a(b)) {
        return true;
    }
    return false;
}
module.exports = b;

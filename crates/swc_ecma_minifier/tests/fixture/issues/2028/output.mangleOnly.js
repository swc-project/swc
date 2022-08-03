function n(n) {
    return n != null;
}
function r(r, u) {
    if (r == null || n(r)) {
        return true;
    }
    return false;
}
module.exports = r;

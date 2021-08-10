function isSymbol(s) {
    return null != s;
}
function isKey(value, object) {
    return !!(null == value || isSymbol(value));
}
module.exports = isKey;

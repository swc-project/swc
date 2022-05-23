function isSymbol(s) {
    return s != null;
}

function isKey(value, object) {
    if (value == null || isSymbol(value)) {
        return true;
    }
    return false;
}

module.exports = isKey;

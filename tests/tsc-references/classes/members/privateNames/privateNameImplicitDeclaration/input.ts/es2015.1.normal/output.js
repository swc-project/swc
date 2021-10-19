function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
// @allowJs: true
// @checkJs: true
// @noEmit: true
// @Filename: privateNameImplicitDeclaration.js
class C {
    constructor(){
        _classPrivateFieldGet(/** @type {string} */ this, _x);
    }
}

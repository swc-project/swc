// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: bug25104.js
class C {
    /** @param {C~A} o */ /**
     * @typedef {C~A} C~B
     * @typedef {object} C~A
     */ /** @param {C~A} o */ constructor(o){}
}

// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
var Outer = {
};
Outer.Inner = class _class {
    m() {
    }
    constructor(){
        this.x = 1;
    }
};
/** @type {Outer.Inner} */ var inner;
inner.x;
inner.m();
var inno = new Outer.Inner();
inno.x;
inno.m();

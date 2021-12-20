var _key, _key1;
// @allowJs: true
// @checkJs: true
// @target: es5
// @lib: es6
// @outDir: ./out
// @declaration: true
// @filename: index.js
const TopLevelSym = Symbol();
const InnerSym = Symbol();
module.exports = {
    [TopLevelSym] (x = 12) {
        return x;
    },
    items: {
        [InnerSym]: (arg = {
            x: 12
        })=>arg.x
    }
};
// @filename: index2.js
const TopLevelSym = Symbol();
const InnerSym = Symbol();
export class MyClass {
    /**
     * @param {typeof TopLevelSym | typeof InnerSym} _p
     */ constructor(_p = InnerSym){
        this[_key1] = "ok";
    // switch on _p
    }
}
_key = TopLevelSym;
_key1 = InnerSym;
MyClass[_key] = 12;

var _key, _key1;
const TopLevelSym = Symbol(), InnerSym = Symbol();
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
const TopLevelSym = Symbol(), InnerSym = Symbol();
export class MyClass {
    constructor(_p = InnerSym){
        this[_key1] = "ok";
    }
}
_key = TopLevelSym, _key1 = InnerSym, MyClass[_key] = 12;

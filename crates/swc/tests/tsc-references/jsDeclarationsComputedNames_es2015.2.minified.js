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
let _InnerSym = InnerSym;
export class MyClass {
    constructor(_p = InnerSym){
        this[_InnerSym] = "ok";
    }
}
MyClass[TopLevelSym] = 12;

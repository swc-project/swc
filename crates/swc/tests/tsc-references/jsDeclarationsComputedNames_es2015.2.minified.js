let TopLevelSym = Symbol(), InnerSym = Symbol();
module.exports = {
    [TopLevelSym]: (x = 12)=>x,
    items: {
        [InnerSym]: (arg = {
            x: 12
        })=>arg.x
    }
};
let TopLevelSym = Symbol(), InnerSym = Symbol(), _InnerSym = InnerSym;
export class MyClass {
    constructor(_p = InnerSym){
        this[_InnerSym] = "ok";
    }
}
MyClass[TopLevelSym] = 12;

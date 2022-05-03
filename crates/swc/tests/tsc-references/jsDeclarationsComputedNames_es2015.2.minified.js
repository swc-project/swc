let TopLevelSym = Symbol(), InnerSym = Symbol();
module.exports = {
    [TopLevelSym]: (x = 12)=>x
    ,
    items: {
        [InnerSym]: (arg = {
            x: 12
        })=>arg.x
    }
};
let TopLevelSym = Symbol(), InnerSym = Symbol();
export class MyClass {
    constructor(_p = InnerSym){
        this[InnerSym] = "ok";
    }
}
MyClass[TopLevelSym] = 12;

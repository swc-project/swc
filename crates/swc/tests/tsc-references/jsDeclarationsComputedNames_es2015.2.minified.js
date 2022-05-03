var _key, _key1;
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
        this[_key1] = "ok";
    }
}
MyClass[_key] = 12, _key = TopLevelSym, _key1 = InnerSym;

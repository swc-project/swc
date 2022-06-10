// @target: es5
// @lib: es2015
// @noTypesAndSymbols: true
// https://github.com/microsoft/TypeScript/issues/40643
const list = [];
for (const comp of list){
    comp.sp.y = comp.sp.r.find((k)=>k.c == (comp.xp ? '1' : '0'));
    for (const item of comp.c){
        var ref;
        item.v = !!((ref = item.t) === null || ref === void 0 ? void 0 : ref.length);
    }
}

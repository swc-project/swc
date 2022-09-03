//// [symbolDeclarationEmit10.ts]
var obj = {
    get [Symbol.isConcatSpreadable] () {
        return '';
    },
    set [Symbol.isConcatSpreadable] (x){}
};

//// [symbolType3.ts]
var s = Symbol();
delete Symbol.iterator, ++s, --s, Symbol(), Symbol(), Symbol(), Symbol(), Symbol();

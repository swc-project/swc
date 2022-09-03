//// [symbolType3.ts]
var s = Symbol();
delete Symbol.iterator, Symbol.toPrimitive, Symbol.toStringTag, ++s, --s, Symbol(), Symbol(), Symbol(), Symbol(), Symbol();

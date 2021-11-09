var obj, s = Symbol();
delete Symbol.iterator, (obj = Symbol.toStringTag) && "undefined" != typeof Symbol && obj.constructor === Symbol, ++s, --s, Symbol(), Symbol(), Symbol(), Symbol(), Symbol();

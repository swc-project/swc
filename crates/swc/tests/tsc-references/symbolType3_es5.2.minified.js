var s = Symbol();
delete Symbol.iterator, Symbol.toPrimitive, (function(obj) {
    obj && "undefined" != typeof Symbol && obj.constructor === Symbol;
})(Symbol.toStringTag), ++s, --s, Symbol(), Symbol(), Symbol(), Symbol(), Symbol();

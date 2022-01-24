var s = Symbol();
delete Symbol.iterator, (function(obj) {
    obj && "undefined" != typeof Symbol && obj.constructor === Symbol;
})(Symbol.toStringTag), ++s, --s, Symbol(), Symbol(), Symbol(), Symbol(), Symbol();

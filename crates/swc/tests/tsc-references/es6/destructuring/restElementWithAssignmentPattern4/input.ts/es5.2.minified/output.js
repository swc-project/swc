var a, ref, arr;
ref = ((function(arr) {
    if (Array.isArray(arr)) return arr;
})(arr = [
    "",
    1
]) || (function(iter) {
    if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
})(arr) || (function() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
})()).slice(0), a = "" = ref[0], ref.b;

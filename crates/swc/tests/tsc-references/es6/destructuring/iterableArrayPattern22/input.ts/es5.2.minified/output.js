var arr;
((function(arr) {
    if (Array.isArray(arr)) return arr;
})(arr = {
    0: "",
    1: !0
}) || (function(iter) {
    if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
})(arr) || (function() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
})()).slice(0);

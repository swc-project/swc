var arr;
(function(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)arr2[i] = arr[i];
        return arr2;
    }
})(arr = void 0) || (function(iter) {
    if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
})(arr) || (function() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
})();

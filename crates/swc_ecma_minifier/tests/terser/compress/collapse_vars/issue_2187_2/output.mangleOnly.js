var n = 1;
console.log((function(r) {
    return r && ++n;
})(n--));

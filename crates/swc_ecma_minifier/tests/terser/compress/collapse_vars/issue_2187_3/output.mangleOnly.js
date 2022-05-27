var a = 1;
console.log((function(b) {
    return b && ++a;
})(a--));

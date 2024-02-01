var o = {
    a: 1
};
console.log(function(k) {
    if (o["a"]) return "PASS";
}(0));

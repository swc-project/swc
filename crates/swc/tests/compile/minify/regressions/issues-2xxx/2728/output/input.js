function fn(bar) {
    var foo = "face";
    return eval(bar);
}
console.log(fn("foo + bar"));

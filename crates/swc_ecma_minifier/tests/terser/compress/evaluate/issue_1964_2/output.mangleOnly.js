function o() {
    var o = /\s/;
    console.log(o.source);
    return "a b c".split(o)[1];
}
console.log(o());

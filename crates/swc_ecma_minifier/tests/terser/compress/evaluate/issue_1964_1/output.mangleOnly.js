function a() {
    var a = /\s/;
    console.log(a.source);
    return "a b c".split(a)[1];
}
console.log(a());

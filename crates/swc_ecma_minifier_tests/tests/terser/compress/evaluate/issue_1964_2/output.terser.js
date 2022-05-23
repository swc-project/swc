function f() {
    console.log(/\s/.source);
    return "a b c".split(/\s/)[1];
}
console.log(f());

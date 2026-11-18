function f() {
    var a = 1;
    try {
        return a = 2;
    } finally{
        console.log(a);
    }
}
console.log(f());

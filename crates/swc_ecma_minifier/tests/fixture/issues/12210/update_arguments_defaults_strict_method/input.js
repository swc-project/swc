class C {
    f(a) {
        arguments[0]++;
        return a;
    }
}
console.log(new C().f(1));

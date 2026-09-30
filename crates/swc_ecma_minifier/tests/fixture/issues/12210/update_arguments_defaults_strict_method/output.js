class C {
    f(a) {
        return arguments[0]++, a;
    }
}
console.log(new C().f(1));

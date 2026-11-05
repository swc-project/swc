class A {
    #x;
    run(value) {
        function noop(value) {}
        return noop(#x in value), noop(), 42;
    }
}
try {
    console.log(new A().run(null));
} catch (e) {
    console.log(e.name);
}

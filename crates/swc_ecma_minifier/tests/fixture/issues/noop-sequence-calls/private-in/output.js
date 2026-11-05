class A {
    #x;
    run(value) {
        return #x in value, 42;
    }
}
try {
    console.log(new A().run(null));
} catch (e) {
    console.log(e.name);
}

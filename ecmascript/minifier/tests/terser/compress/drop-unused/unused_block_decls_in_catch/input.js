function foo() {
    try {
        foo();
    } catch (ex) {
        let x = 10;
        const y = 10;
        class Zee {}
    }
}

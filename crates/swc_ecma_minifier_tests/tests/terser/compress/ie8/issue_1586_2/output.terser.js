function f() {
    try {
        x();
    } catch (c) {
        console.log(c.message);
    }
}

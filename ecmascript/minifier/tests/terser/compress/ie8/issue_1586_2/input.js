function f() {
    try {
        x();
    } catch (err) {
        console.log(err.message);
    }
}

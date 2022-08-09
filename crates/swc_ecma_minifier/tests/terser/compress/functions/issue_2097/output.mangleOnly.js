function t() {
    try {
        throw 0;
    } catch (t) {
        console.log(arguments[0]);
    }
}
t(1);

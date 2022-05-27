function a() {
    try {
        throw 0;
    } catch (a) {
        console.log(arguments[0]);
    }
}
a(1);

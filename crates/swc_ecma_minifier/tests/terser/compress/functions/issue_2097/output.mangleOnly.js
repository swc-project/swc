function o() {
    try {
        throw 0;
    } catch (o) {
        console.log(arguments[0]);
    }
}
o(1);

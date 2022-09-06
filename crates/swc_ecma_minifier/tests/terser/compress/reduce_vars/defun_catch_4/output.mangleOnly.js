try {
    throw 42;
} catch (o) {
    function o() {}
    console.log(o);
}

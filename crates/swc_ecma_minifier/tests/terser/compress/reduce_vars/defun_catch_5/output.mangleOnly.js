try {
    throw 42;
} catch (o) {
    console.log(o);
    function o() {}
}

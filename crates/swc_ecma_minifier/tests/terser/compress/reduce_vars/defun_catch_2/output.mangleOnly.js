try {
    function o() {}
    throw 42;
} catch (o) {
    console.log(o);
}

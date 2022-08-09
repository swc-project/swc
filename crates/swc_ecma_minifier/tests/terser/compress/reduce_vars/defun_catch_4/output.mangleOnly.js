try {
    throw 42;
} catch (t) {
    function t() {}
    console.log(t);
}

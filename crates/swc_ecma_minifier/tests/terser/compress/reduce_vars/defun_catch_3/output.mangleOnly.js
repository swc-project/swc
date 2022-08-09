try {
    throw 42;
    function t() {}
} catch (c) {
    console.log(c);
}

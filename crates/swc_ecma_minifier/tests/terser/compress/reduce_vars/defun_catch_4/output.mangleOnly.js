try {
    throw 42;
} catch (a) {
    function a() {}
    console.log(a);
}

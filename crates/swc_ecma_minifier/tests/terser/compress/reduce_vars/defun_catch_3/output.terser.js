try {
    throw 42;
    function a() {}
} catch (a) {
    console.log(a);
}

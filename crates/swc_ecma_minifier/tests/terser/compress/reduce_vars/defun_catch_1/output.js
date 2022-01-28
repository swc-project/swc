function a() {}
try {
    throw 42;
} catch (a) {
    console.log(a);
}

try {
    var a = A,
        b = 1;
    throw a;
} catch (e) {
    console.log(b);
}

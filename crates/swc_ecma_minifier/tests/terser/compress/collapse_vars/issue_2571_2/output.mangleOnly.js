try {
    var o = A, c = 1;
    throw o;
} catch (r) {
    console.log(c);
}

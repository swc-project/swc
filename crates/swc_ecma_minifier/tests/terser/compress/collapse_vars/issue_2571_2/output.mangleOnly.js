try {
    var o = A,
        c = 1;
    throw o;
} catch (o) {
    console.log(c);
}

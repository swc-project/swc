function e(e) {
    const { a: t , b: a  } = e;
    console.log(a);
}
e({
    a: 1,
    b: 2
});
e({
    get a () {
        var t = "side effect";
        console.log(t);
        return t;
    },
    b: 4
});

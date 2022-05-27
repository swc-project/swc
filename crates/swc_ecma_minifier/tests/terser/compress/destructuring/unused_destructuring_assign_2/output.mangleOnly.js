function a(b) {
    var c;
    let a;
    ({ a: c , b: a  } = b);
    console.log(a);
}
a({
    a: 1,
    b: 2
});
a({
    get a () {
        var b = "side effect";
        console.log(b);
        return b;
    },
    b: 4
});

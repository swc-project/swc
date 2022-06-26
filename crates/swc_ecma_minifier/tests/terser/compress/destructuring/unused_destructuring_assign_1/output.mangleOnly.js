function a(a) {
    var b;
    let c;
    ({ a: b , b: c  } = a);
    console.log(c);
}
a({
    a: 1,
    b: 2
});
a({
    b: 4
});

function a(a) {
    var b;
    let l;
    ({ a: b , b: l  } = a);
    console.log(l);
}
a({
    a: 1,
    b: 2
});
a({
    b: 4
});

for (let o = 9, l = 0; l < 20; l += o) {
    let e = o++ + l;
    console.log(o, e, l);
    for (let l = e, t = e * e, c = 0; c < 10; c++) console.log(o, e, t, l, c);
}

for (let a = 9, i = 0; i < 20; i += a) {
    let b = a++ + i;
    console.log(a, b, i);
    for (let k = b, m = b * b, i = 0; i < 10; i++) {
        console.log(a, b, m, k, i);
    }
}

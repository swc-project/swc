var c = 0;
c++,
    new (function () {
        (this.a = 0), (c = 1 + (c += 1)), c++;
    })(),
    c++,
    console.log(c);

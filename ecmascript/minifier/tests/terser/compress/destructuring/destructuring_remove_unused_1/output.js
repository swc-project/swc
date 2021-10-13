function a() {
    var a1 = [
        1
    ];
    var [b] = a1;
    f(b);
}
function b() {
    var a1 = {
        b: 1
    };
    var { b: b1  } = a1;
    f(b1);
}
function c() {
    var a1 = [
        [
            1
        ]
    ];
    var [[b1]] = a1;
    f(b1);
}
function d() {
    var a1 = {
        b: {
            b: 1
        }
    };
    var { b: { b: b1  }  } = a1;
    f(b1);
}
function e() {
    var a1 = [
        1,
        2,
        3,
        4,
        5
    ];
    var x = [
        [
            1,
            2,
            3
        ]
    ];
    var y = {
        h: 1
    };
    var [b1, ...c1] = a1;
    var [...[e1, f]] = x;
    var [...{ g: h  }] = y;
    f(b1, c1, e1, f, g);
}

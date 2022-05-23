function a() {
    var a1 = [
        1
    ];
    var [b1] = a1;
    f(b1);
}
function b() {
    var a2 = {
        b: 1
    };
    var { b: b2  } = a2;
    f(b2);
}
function c() {
    var a3 = [
        [
            1
        ]
    ];
    var [[b3]] = a3;
    f(b3);
}
function d() {
    var a4 = {
        b: {
            b: 1
        }
    };
    var { b: { b: b4  }  } = a4;
    f(b4);
}
function e() {
    var a5 = [
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
    var [b5, ...c1] = a5;
    var [...[e1, f]] = x;
    var [...{ g: h  }] = y;
    f(b5, c1, e1, f, g);
}

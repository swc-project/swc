function a() {
    var a = [
        1
    ];
    var [b] = a;
    f(b);
}
function b() {
    var a = {
        b: 1
    };
    var { b: b  } = a;
    f(b);
}
function c() {
    var a = [
        [
            1
        ]
    ];
    var [[b]] = a;
    f(b);
}
function d() {
    var a = {
        b: {
            b: 1
        }
    };
    var { b: { b: b  }  } = a;
    f(b);
}
function e() {
    var a = [
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
    var [b, ...c] = a;
    var [...[e, f1]] = x;
    var [...{ g: h  }] = y;
    f1(b, c, e, f1, g);
}

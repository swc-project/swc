function a1() {
    var a = [
        1
    ];
    var [b] = a;
    f(b);
}
function b1() {
    var a = {
        b: 1
    };
    var { b: b  } = a;
    f(b);
}
function c1() {
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
function e1() {
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
    var [...[e, f]] = x;
    var [...{ g: h  }] = y;
    f(b, c, e, f, g);
}

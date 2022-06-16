function a() {
    var a = "foo";
    var b = [
        1
    ];
    var [c] = b;
    f(c);
}
function b() {
    var a = "foo";
    var b = {
        b: 1
    };
    var { b: c  } = b;
    f(c);
}
function c() {
    var a = "foo";
    var b = [
        [
            1
        ]
    ];
    var [[c]] = b;
    f(c);
}
function d() {
    var a = "foo";
    var b = {
        b: {
            b: 1
        }
    };
    var { b: { b: c  } ,  } = b;
    f(c);
}
function e() {
    var a = "foo";
    var b = [
        1,
        2,
        3,
        4,
        5
    ];
    var c = [
        [
            1,
            2,
            3
        ]
    ];
    var d = {
        h: 1
    };
    var [e, ...h] = b;
    var [...[i, j]] = c;
    var [...{ g: k  }] = d;
    j(e, h, i, j, g);
}

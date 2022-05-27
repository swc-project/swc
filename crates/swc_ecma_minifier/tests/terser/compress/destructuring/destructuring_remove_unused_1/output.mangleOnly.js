function a() {
    var c = "foo";
    var a = [
        1
    ];
    var [b] = a;
    f(b);
}
function b() {
    var c = "foo";
    var a = {
        b: 1
    };
    var { b: b  } = a;
    f(b);
}
function c() {
    var c = "foo";
    var a = [
        [
            1
        ]
    ];
    var [[b]] = a;
    f(b);
}
function d() {
    var c = "foo";
    var a = {
        b: {
            b: 1
        }
    };
    var { b: { b: b  } ,  } = a;
    f(b);
}
function e() {
    var j = "foo";
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
    var [...[i, a]] = c;
    var [...{ g: k  }] = d;
    a(e, h, i, a, g);
}

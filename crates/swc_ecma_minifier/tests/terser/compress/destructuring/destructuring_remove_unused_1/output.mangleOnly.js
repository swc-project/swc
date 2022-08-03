function a() {
    var a = "foo";
    var r = [
        1
    ];
    var [v] = r;
    f(v);
}
function r() {
    var a = "foo";
    var r = {
        b: 1
    };
    var { b: v  } = r;
    f(v);
}
function v() {
    var a = "foo";
    var r = [
        [
            1
        ]
    ];
    var [[v]] = r;
    f(v);
}
function n() {
    var a = "foo";
    var r = {
        b: {
            b: 1
        }
    };
    var { b: { b: v  } ,  } = r;
    f(v);
}
function _() {
    var a = "foo";
    var r = [
        1,
        2,
        3,
        4,
        5
    ];
    var v = [
        [
            1,
            2,
            3
        ]
    ];
    var n = {
        h: 1
    };
    var [_, ...b] = r;
    var [...[c, i]] = v;
    var [...{ g: o  }] = n;
    i(_, b, c, i, g);
}

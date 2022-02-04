// @strictNullChecks: true
function f1() {
    let x = 1;
    x;
    let y = "";
    y;
}
function f2() {
    let [x] = [
        1
    ];
    x;
    let [y] = [
        ""
    ];
    y;
    let [z = ""] = [
        undefined
    ];
    z;
}
function f3() {
    let [x] = [
        1
    ];
    x;
    let [y] = [
        ""
    ];
    y;
    let [z = ""] = [
        undefined
    ];
    z;
}
function f4() {
    let { x  } = {
        x: 1
    };
    x;
    let { y  } = {
        y: ""
    };
    y;
    let { z =""  } = {
        z: undefined
    };
    z;
}
function f5() {
    let { x  } = {
        x: 1
    };
    x;
    let { y  } = {
        y: ""
    };
    y;
    let { z =""  } = {
        z: undefined
    };
    z;
}
function f6() {
    let { x  } = {};
    x;
    let { y  } = {};
    y;
    let { z =""  } = {};
    z;
}
function f7() {
    let o = {
        x: 1
    };
    let { x  } = o;
    x;
}

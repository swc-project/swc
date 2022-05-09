() => {
    let x1 = 1;
    foo(x1);
};

() => {
    for (let i in [1, 2, 3]) {
        foo(i);
    }
}

() => {
    let [x2 = -1, y2] = [1, 2];
    y2 = 0;
}

() => {
    let { a: x3 = -1, b: y3 } = { a: 1, b: 2 };
    y3 = 0;
}


(function () { let x = 1; foo(x); })();

(function () { for (let i in [1, 2, 3]) { foo(i); } })();

(function () { for (let x of [1, 2, 3]) { foo(x); } })();

(function () { let [x = -1, y] = [1, 2]; y = 0; })();

() => {
    let f = (function () { let g = x; })();
    f = 1;
}

(function () { let { a: x = -1, b: y } = { a: 1, b: 2 }; y = 0; })();

() => {
    let x = 0;
    { let x = 1; foo(x); }
    x = 0;
}

() => {
    for (let i = 0; i < 10; ++i) { let x = 1; foo(x); }
}

() => {
    for (let i in [1, 2, 3]) { let x = 1; foo(x); }
}

() => {
    var foo = function () {
        for (const b5 of c5) {
            let l;
            l = 1;
        }
    };
}

() => {
    var foo = function () {
        for (const b of c) {
            let a;
            ({ a } = 1);
        }
    };
}

() => {
    let x;
    x = 0;
}

() => {
    switch (a) { case 0: let x; x = 0; }
}

(function () { let x; x = 1; })();

() => {
    let { a = 0, b } = obj; b = 0; foo(a, b);
}

() => {
    let { a: { b, c } } = { a: { b: 1, c: 2 } }; b = 3;
}

() => {
    let { a: { b, c } } = { a: { b: 1, c: 2 } }
}

() => {
    let [a] = [1]
}

() => {
    let predicate;
    [, { foo: returnType, predicate }] = foo();
}

() => {
    let x = 'x', y = 'y';
}


let timer;
function initialize() {
    if (foo()) {
        clearInterval(timer);
    }
}
timer = setInterval(initialize, 100);


() => {
    let { l, ...rest } = {};
    l = 1;
}

// valid
() => {
    var x = 0;
}

() => {
    let x;
}

() => {
    let x; { x = 0; } foo(x);
}

() => {
    let x = 0; x = 1;
}

() => {
    let i = 0;
    i++;
}

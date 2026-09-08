function f() {
    return 0;
}

function test() {
    switch (1) {
        case f():
            break;
        case (console.log("effect"), 2):
            var x;
    }

    console.log(x);
}

test();

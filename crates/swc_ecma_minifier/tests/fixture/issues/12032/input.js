function run(f) {
    f();
}

function foo(b) {
    run(() => {
        b = 2;
    });

    console.log(arguments[0]);
}

foo(1);

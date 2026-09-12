function run(obj) {
    with (obj) {
        (function () {
            (function (c) {
                c = 1;
                console.log(c);
            })(0);
        })();
    }

    console.log(obj.c);
}

run({ c: 10 });

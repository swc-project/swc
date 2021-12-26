async function foo(a) {
    return bar1;

    const bar1 = "bar1";
    console.log("dead code should not output", bar1);

    async function bar1(b) {
        return bar2;

        const bar2 = "bar2";
        console.log("dead code should not output", bar2);

        async function bar2(c) {
            return bar3;

            const bar3 = "bar3";
            console.log("dead code should not output", bar3);

            async function bar3(d) {
                return a + b + c + d;
            }
        }
    }
}

foo(1)
    .then((t) => t(2))
    .then((t) => t(3))
    .then((t) => t(4))
    .then(console.log);

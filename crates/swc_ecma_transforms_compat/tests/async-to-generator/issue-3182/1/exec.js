const myWrapper = (myFunc) => {
    console.log("arity", myFunc.length);
};

myWrapper(async (one, two, three) => {
    return "irrelevant";
});

(async () => {
    (async (x, y, myWrapper, myFunc) => {
        x(console.log, y);

        myWrapper(myFunc);
    })(
        async function (...[x, y]) {
            return x(y);
        },
        await (async function bar(x, y, ...z) {
            return bar.length;
        })(),
        (myFunc) => {
            console.log("arity", myFunc.length);
        },
        async (one, two, three) => {
            return "irrelevant";
        }
    );
})();

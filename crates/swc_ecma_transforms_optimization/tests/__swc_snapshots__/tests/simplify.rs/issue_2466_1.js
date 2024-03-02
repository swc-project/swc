const X = {
    run () {
        console.log(this === globalThis);
    }
};
X.run();
(0, X.run)();

((factory) => {
    factory();
})(() =>
    ((fn) => {
        fn()().prop();
    })(() => {
        let bar = () => {
            var quux = () => {
                    console.log("PASS");
                },
                foo = () => {
                    console.log;
                    quux();
                };
            return { prop: foo };
        };
        return bar;
    })
);

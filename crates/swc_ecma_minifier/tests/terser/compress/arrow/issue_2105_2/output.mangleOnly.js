((o) => {
    o();
})(() =>
    ((o) => {
        o()().prop();
    })(() => {
        let o = () => {
            var o = () => {
                    console.log("PASS");
                },
                r = () => {
                    console.log;
                    o();
                };
            return { prop: r };
        };
        return o;
    })
);

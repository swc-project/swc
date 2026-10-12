async function outerAsync() {
    enum E {
        A = (() => {
            let await;
            for (await of [1]) {}
            async function innerAsync() {
                let yield;
                for await (yield of [1]) {}
            }
            return 1;
        })(),
    }
}
function* outerGenerator() {
    enum E {
        A = (() => {
            let yield;
            for (yield of [1]) {}
            return 1;
        })(),
    }
}

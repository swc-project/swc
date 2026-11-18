async function outerAsync() {
    namespace N {
        let yield;
        for await (yield of [1]) {}
        function ordinary() {
            let await;
            for (await of [1]) {}
        }
    }
    for await (const value of [1]) {}
}
function* outerGenerator() {
    namespace N {
        function ordinary() {
            let yield;
            for (yield of [1]) {}
        }
    }
}

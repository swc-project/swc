let await, yield;
for (await of [1]) {}
for (yield of [1]) {}
async function outerAsync() {
    function ordinary() {
        let await;
        for (await of [1]) {}
    }
    let yield;
    for await (yield of [1]) {}
}
function* outerGenerator() {
    function ordinary() {
        let yield;
        for (yield of [1]) {}
    }
}

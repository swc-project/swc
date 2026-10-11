namespace N {
    let await, yield;
    for (await of [1]) {}
    for (yield of [1]) {}
    async function innerAsync() {
        let yield;
        for await (yield of [1]) {}
    }
}

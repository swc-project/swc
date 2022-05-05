async function* g1() {
    yield "OK";
    yield "OK";
    yield "OK";
}

async function* g2() {
    for await (const g of g1()) {
        console.log("g2:", g);
        yield g;
    }
}

(async () => {
    for await (const g of g2()) {
        console.log("main:", g);
    }
})();

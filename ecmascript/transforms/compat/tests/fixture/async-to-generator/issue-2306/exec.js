async function* g1() {
    yield "OK";
    yield "OK";
    yield "OK";
}

async function* g2() {
    for await (const g of g1()) {
        yield g;
    }
}


(async () => {
    for await (const g of g2()) {
        console.log(g);
    }
})();
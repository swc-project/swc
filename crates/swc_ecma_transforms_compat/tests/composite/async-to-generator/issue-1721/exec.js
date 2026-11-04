async function* lol() {
    yield 1;
    yield 2;
}

async function main() {
    for await (const x of lol()) {
        console.log(x);
    }
}
main();

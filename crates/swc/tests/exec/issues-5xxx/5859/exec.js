const result = [];
async function* foo() {
    const input = ["hello", "swc"];

    for (i of input) {
        result.push({ x: i });
        result.push({ y: await i });
        result.push({
            a: 1,
            b: yield i,
        });
    }
}

const iter = foo();

async function main() {
    let state;
    for (let x = await iter.next(); !x.done; x = await iter.next(state)) {
        state = `[${x.value}]`;
    }
    console.log(result);
}

main();

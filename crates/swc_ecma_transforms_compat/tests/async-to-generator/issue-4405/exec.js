async function* asyncGenerator() {
    for (let i = 5; i < 10; i++) {
        yield new Promise((res) => setTimeout(() => res({ success: true }), 5));
    }
    yield { success: true };
}

async function* execute() {
    yield* asyncGenerator();
}

(async () => {
    for await (const p of execute()) {
        console.log(await p);
    }
})();

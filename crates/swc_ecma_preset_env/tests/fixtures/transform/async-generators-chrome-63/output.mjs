export async function* values() {
    yield 1;
}
export async function getAll(iterable) {
    const results = [];
    for await (const item of iterable){
        results.push(item);
    }
    return results;
}

export async function collect(source) {
    for await (const value of source) {
        sink(value);
    }
}

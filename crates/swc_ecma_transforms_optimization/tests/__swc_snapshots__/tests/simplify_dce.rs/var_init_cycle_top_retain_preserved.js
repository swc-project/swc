var A = class {
    m() {
        return parseAsync();
    }
};
async function parseAsync() {
    return new A();
}

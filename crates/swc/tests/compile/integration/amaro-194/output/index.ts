class Wrapper {
    #inner;
    constructor(inner){
        this.#inner = inner;
    }
    wrap(x) {
        return this.#inner(x);
    }
}
async function main() {
    // The error happens here:
    const promiseWrapper = new Wrapper(Promise.resolve.bind(Promise));
    const strPromise = promiseWrapper.wrap("Hello, World!");
    const str = await strPromise;
    console.log(str);
}
main();

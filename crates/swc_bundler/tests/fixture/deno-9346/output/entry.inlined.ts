function __default(message) {
    console.log(message);
}
cli();
async function cli() {
    __default("It works!");
}
export { cli as default };

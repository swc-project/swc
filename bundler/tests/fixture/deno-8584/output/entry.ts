const mod = await async function() {
    async function setup() {
    }
    await setup();
    const setup1 = setup;
    return {
        setup: setup1
    };
}();
const log = mod;
const log1 = log;
const log2 = log1;
await log2.setup({
});

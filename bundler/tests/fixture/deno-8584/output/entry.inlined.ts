const mod = await async function() {
    async function setup() {
    }
    const setup1 = setup;
    await setup();
    return {
        setup: setup
    };
}();
await mod.setup({
});

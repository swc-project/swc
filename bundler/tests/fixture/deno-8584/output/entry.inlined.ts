const mod = await async function() {
    async function setup() {
    }
    await setup();
    const setup1 = setup;
    return {
        setup: setup
    };
}();
await mod.setup({
});

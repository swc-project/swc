async function setup() {
}
await setup();
const mod = await async function() {
    return {
        setup: setup
    };
}();
await mod.setup({
});

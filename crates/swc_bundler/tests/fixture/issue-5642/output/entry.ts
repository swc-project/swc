const starExport = 1;
await Promise.resolve(true);
const mod = await async function() {
    return {
        starExport
    };
}();
console.log(mod);

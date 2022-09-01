await Promise.resolve(true);
const mod = await async function() {
    return {
        starExport: 1
    };
}();
console.log(mod);

await (() => {
    console.log("non-IIFE");
});

await (() => {
    console.log("IIFE");
})();

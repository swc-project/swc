(async () => {
    // Blob is not defined
    // const blob = new Blob();

    new Uint8Array(await Promise.resolve(10));
    console.log("Success");
})();

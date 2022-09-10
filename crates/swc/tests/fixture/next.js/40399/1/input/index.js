(async () => {
    const blob = new Blob();
    new Uint8Array(await blob.arrayBuffer());
    console.log("Success");
})();

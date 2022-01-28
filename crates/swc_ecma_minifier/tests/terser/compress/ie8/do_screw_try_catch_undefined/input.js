function a(b) {
    try {
        throw "Stuff";
    } catch (undefined) {
        console.log("caught: " + undefined);
    }
    console.log("undefined is " + undefined);
    return b === undefined;
}

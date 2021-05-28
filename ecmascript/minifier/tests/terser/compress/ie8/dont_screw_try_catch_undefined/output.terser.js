function a(n) {
    try {
        throw "Stuff";
    } catch (undefined) {
        console.log("caught: " + undefined);
    }
    console.log("undefined is " + undefined);
    return n === undefined;
}

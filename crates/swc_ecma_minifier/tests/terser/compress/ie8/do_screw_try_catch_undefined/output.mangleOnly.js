function a(a) {
    try {
        throw "Stuff";
    } catch (b) {
        console.log("caught: " + b);
    }
    console.log("undefined is " + undefined);
    return a === undefined;
}

function n(n) {
    try {
        throw "Stuff";
    } catch (e) {
        console.log("caught: " + e);
    }
    console.log("undefined is " + undefined);
    return n === undefined;
}

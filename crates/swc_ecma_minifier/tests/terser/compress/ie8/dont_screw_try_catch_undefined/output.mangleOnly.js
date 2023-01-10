function n(n) {
    try {
        throw "Stuff";
    } catch (n) {
        console.log("caught: " + n);
    }
    console.log("undefined is " + undefined);
    return n === undefined;
}

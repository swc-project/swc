function t(t) {
    try {
        throw "Stuff";
    } catch (n) {
        console.log("caught: " + n);
    }
    console.log("undefined is " + undefined);
    return t === undefined;
}

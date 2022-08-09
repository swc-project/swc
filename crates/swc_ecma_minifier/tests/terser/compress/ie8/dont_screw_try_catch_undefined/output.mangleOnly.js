function t(t) {
    try {
        throw "Stuff";
    } catch (o) {
        console.log("caught: " + o);
    }
    console.log("undefined is " + undefined);
    return t === undefined;
}

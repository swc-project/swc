function a(o) {
    try {
        throw "Stuff";
    } catch (o) {
        console.log("caught: " + o);
    }
    console.log("undefined is " + void 0);
    return void 0 === o;
}

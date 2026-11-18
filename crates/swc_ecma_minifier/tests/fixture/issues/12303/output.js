function* spreadGenerator(name) {
    console.log(name), yield 1;
}
function g() {
    return console.log("ordinary"), 1;
}
function* throwingGenerator() {
    throw console.log("throwing"), Error("spread throw");
}
Boolean(...spreadGenerator("call spread")), new Boolean(...spreadGenerator("new spread")), g();
try {
    Boolean(...throwingGenerator());
} catch (error) {
    console.log(error.message);
}

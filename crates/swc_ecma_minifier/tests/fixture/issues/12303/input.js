function* spreadGenerator(name) {
    console.log(name);
    yield 1;
}

Boolean(...spreadGenerator("call spread"));
new Boolean(...spreadGenerator("new spread"));

function g() {
    console.log("ordinary");
    return 1;
}

Boolean(g());

function* throwingGenerator() {
    console.log("throwing");
    throw new Error("spread throw");
}

try {
    Boolean(...throwingGenerator());
} catch (error) {
    console.log(error.message);
}

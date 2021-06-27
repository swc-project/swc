let something = "PASS";
function getSomething() {
    return something;
}
function setSomething() {
    something = { value: 42 };
}
function main() {
    if (typeof somethingElse == "undefined") {
        const something = getSomething();
        console.log(something);
    }
}
main();

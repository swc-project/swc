let count;
new class Foo {
    [(count = 0, (numToAdd)=>count += numToAdd)]() {
        console.log("Hello, world!");
    }
}();
export { };

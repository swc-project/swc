const createCounter = () => {
    let count = 0;
    return (numToAdd) => {
        count += numToAdd;
        return count;
    };
};

new (class Bar {
    x = new (class Foo {
        [createCounter()]() {
            console.log("Hello, world!");
        }
    })();
})();

export {};

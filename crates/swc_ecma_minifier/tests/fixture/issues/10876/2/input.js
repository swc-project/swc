const createCounter1 = () => {
    let count = 0;
    return (numToAdd) => {
        count += numToAdd;
        return count;
    };
};

new (class Foo {
    [createCounter1()]() {
        console.log("Hello, world!");
    }
})();

export {};

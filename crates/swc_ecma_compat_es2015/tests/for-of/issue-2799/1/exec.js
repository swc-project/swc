const block = () => {
    for (const value in { a: 1, b: 2, c: 3 }) {
        for (let i = 0; i < 10; i++) {
            function something() {}
            continue;

            return { value };
        }
    }
};
console.log(block());
console.log("OK?");

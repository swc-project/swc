const test = () => {
    let a = 0;
    let b = 0;
    let c = [1, 2, 3, 4, 5].map((i) => {
        a += i;
        b += i;
        return i;
    });
    return [a, b, c];
};

const [a, b, c] = test();
console.log("test", a, b, c);
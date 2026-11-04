let value, tail;
let source = {
    get first() {
        source = { second: 3 };
        return 1;
    },
    second: 2,
};
const original = source;
const result = ({ first: value, ...tail } = source);
console.log(result === original, value, JSON.stringify(tail));

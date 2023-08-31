const obj = {
    foo: 1,
    bar: 2,
};

console.log(obj.bar);

export default function (test = obj) {
    console.log(test);
};
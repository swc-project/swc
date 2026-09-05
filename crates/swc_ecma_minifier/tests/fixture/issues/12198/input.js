console.log(
    (2.5).toExponential(0),
    (3.5).toExponential(0),
    (-2.5).toExponential(0),
);

console.log((-0).toExponential(), (-0).toExponential(2));
console.log((2.5).toExponential(), (1.25).toExponential(1));
console.log((3.4).toExponential(0), (0.000112356).toExponential(4));

try {
    console.log((1.23).toExponential(-1));
} catch (error) {
    console.log(error.name);
}

console.log(NaN.toExponential(-1), Infinity.toExponential(1000));
console.log((5e-324).toExponential(20));
console.log((1.4305643464300736e-77).toExponential(20));
console.log((0.09999999999999999).toExponential(2));

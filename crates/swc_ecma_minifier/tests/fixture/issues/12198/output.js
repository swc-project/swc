console.log("3e+0", "4e+0", "-3e+0");
console.log("0e+0", "0.00e+0");
console.log("2.5e+0", "1.3e+0");
console.log("3e+0", "1.1236e-4");
try {
    console.log(1.23.toExponential(-1));
} catch (error) {
    console.log(error.name);
}
console.log("NaN", "Infinity");
console.log(5e-324.toExponential(20));

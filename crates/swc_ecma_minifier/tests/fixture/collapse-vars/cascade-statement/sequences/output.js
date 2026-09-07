function branch(value) {
    if (value) return value;
    console.log("else");
}
console.log(branch(1)), branch(0);

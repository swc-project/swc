function run(value) {
    return new Date(value ? 1 : 2);
}
console.log(run(true).getTime());

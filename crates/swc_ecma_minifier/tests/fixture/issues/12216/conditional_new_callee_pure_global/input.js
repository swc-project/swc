function run(value) {
    return value ? new Date(1) : new Date(2);
}

console.log(run(true).getTime());

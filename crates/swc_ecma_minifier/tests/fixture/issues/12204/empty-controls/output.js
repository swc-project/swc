function* values() {
    console.log("live constructor"), yield 1;
}
console.log(new Set(values()).size);

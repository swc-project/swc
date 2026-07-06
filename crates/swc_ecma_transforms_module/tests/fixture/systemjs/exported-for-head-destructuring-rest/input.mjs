export let first, rest;

for ([first, ...rest] of rows) {
    console.log(first, rest);
}

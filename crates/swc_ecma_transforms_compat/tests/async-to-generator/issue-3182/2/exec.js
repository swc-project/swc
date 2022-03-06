console.log((async (x, y) => {}).length);
console.log((async (x, ...y) => {}).length);
console.log((async (x = 1, ...y) => {}).length);

console.log(async function (x, y) {}.length);
console.log(async function (x, ...y) {}.length);
console.log(async function (x = 1, ...y) {}.length);

console.log((async (x, []) => {}).length);
console.log((async (x, ...[]) => {}).length);
console.log((async (x = 1, ...[]) => {}).length);

console.log(async function (x, [a]) {}.length);
console.log(async function (x, ...[a]) {}.length);
console.log(async function (x = 1, ...[a]) {}.length);

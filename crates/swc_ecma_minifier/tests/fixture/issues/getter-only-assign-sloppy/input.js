let count = 0;
function assign() {
    ({ get count() { return count; } }).count = 1;
}
function compound() {
    ({ get count() { return count; } }).count += 1;
}
assign();
compound();
console.log(count);

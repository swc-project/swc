function compound() {
    ({ get count() { console.log("getter"); return 1; } }).count += 1;
}
function plain() {
    ({ get count() { console.log("FAIL"); return 1; } }).count = 1;
}
compound();
plain();

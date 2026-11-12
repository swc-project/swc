let count = 0;
export function assign() {
    ({ get count() { return count; } }).count = 1;
}
try { assign(); console.log("FAIL"); } catch (e) { console.log(e instanceof TypeError); }
console.log(count);

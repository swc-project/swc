let count = 0;
function sloppy() {
    ({ get count() { return count; } }).count = 1;
}
function strict() {
    "use strict";
    ({ get count() { return count; } }).count = 1;
}
sloppy();
try { strict(); console.log("FAIL"); } catch (e) { console.log(e instanceof TypeError); }
console.log(count);

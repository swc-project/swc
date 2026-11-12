"use strict";
let count = 0;
function assign() {
    ({ get count() { return count; } }).count = 1;
}
function compound() {
    ({ get count() { return count; } }).count += 1;
}
function plain() {
    ({ count }).count = 1;
}
try { assign(); console.log("FAIL"); } catch (e) { console.log(e instanceof TypeError); }
try { compound(); console.log("FAIL"); } catch (e) { console.log(e instanceof TypeError); }
plain();
console.log(count);

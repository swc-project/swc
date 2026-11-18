function directBreak() {
    do break;
    while (false)
    "use strict";
    return void 0 === this;
}
function nestedStringContinue() {
    do continue;
    while (false)
    "use strict";
    return void 0 === this;
}
function enclosingBlockBreak() {
    do break;
    while (false)
    "use strict";
    return void 0 === this;
}
console.log(directBreak());
console.log(nestedStringContinue());
console.log(enclosingBlockBreak());

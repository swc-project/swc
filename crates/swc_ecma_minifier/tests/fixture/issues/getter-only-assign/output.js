"use strict";
try {
    ({
        get count () {
            return 0;
        }
    }).count = 1, console.log("FAIL");
} catch (e) {
    console.log(e instanceof TypeError);
}
try {
    ({
        get count () {
            return 0;
        }
    }).count += 1, console.log("FAIL");
} catch (e) {
    console.log(e instanceof TypeError);
}
console.log(0);

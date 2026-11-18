function directBreak() {
    do {
        (function () {});
        break;
    } while (false);
    "use strict";
    return this === undefined;
}

function nestedStringContinue() {
    do {
        (function () {});
        continue;
    } while (false);
    {
        {
            ;
            "use strict";
        }
    }
    return this === undefined;
}

function enclosingBlockBreak() {
    {
        do {
            (function () {});
            break;
        } while (false);
    }
    "use strict";
    return this === undefined;
}

console.log(directBreak());
console.log(nestedStringContinue());
console.log(enclosingBlockBreak());

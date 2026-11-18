function declaration() {
    "custom";
    "use strict";
    return this === undefined;
}
const expression = function() {
    "custom";
    "use strict";
    return this === undefined;
};
const arrow = ()=>{
    "custom";
    "another";
    "use strict";
};
class C {
    method() {
        "custom";
        "use strict";
    }
}

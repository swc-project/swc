function declaration() {
    "custom";
    type T = number;
    "use strict";
    return this === undefined;
}

const expression = function () {
    "custom";
    interface I {}
    "use strict";
    return this === undefined;
};

const arrow = () => {
    "custom";
    "another";
    type T = number;
    "use strict";
};

class C {
    method() {
        "custom";
        type T = number;
        "use strict";
    }
}

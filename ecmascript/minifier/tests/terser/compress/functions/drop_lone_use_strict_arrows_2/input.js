let f0 = () => 0;
let f1 = () => {
    "use strict";
};
let f2 = () => {
    "use strict";
    let f3 = () => {
        "use strict";
    };
};
(() => {
    "use strict";
    return undefined;
})();

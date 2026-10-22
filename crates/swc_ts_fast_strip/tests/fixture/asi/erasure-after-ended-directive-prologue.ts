function afterStatement() {
    "custom";
    run();
    type T = number;
    "use strict";
}

function afterEmptyStatement() {
    "custom";
    ;
    type T = number;
    "use strict";
}

function afterParenthesizedString() {
    ("custom");
    type T = number;
    "use strict";
}

function inOrdinaryBlock() {
    {
        "custom";
        type T = number;
        "use strict";
    }
}

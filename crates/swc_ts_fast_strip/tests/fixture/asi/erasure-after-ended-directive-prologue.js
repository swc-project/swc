function afterStatement() {
    "custom";
    run();
                    
    "use strict";
}

function afterEmptyStatement() {
    "custom";
    ;
                    
    "use strict";
}

function afterParenthesizedString() {
    ("custom");
                    
    "use strict";
}

function inOrdinaryBlock() {
    {
        "custom";
                        
        "use strict";
    }
}

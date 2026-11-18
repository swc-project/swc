function objectParent() {
    ({
        value: class {
            static{
                do {
                    (function() {});
                    break;
                }while (false)
            }
        }
    });
    "use strict";
    return void 0 === this;
}
function switchParent(flag) {
    switch(flag){
        case 1:
            do {
                (function() {});
                break;
            }while (false)
        case 2:
            do {
                (function() {});
                break;
            }while (false)
        case 3:
            do {
                (function() {});
                break;
            }while (false)
    }
    "use strict";
    return void 0 === this;
}
console.log(objectParent());
console.log(switchParent(1));

"use strict";
function outer(value) {
    class Reader {
        read() {
            return ()=>value;
        }
    }
    return new Reader().read()();
}
consume(outer(1));

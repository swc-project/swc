!// The name of a named function expression is immutable. A write to it throws
// in the strict class body, but does nothing in this sloppy code.
function named() {
    try {
        class C {
            static set(x) {
                C.value = x;
            }
            static cache = named = 1;
        }
        console.log("no error C");
    } catch (e) {
        console.log(e.name);
    }
    try {
        class D {
            static set(x) {
                D.value = x;
            }
            static cache = named++;
        }
        console.log("no error D");
    } catch (e) {
        console.log(e.name);
    }
    try {
        class E {
            static set(x) {
                E.value = x;
            }
            [(named = 1, "method")]() {}
        }
        console.log("no error E");
    } catch (e) {
        console.log(e.name);
    }
}();

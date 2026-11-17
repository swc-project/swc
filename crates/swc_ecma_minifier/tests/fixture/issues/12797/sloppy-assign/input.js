// The class body is strict, so these assignments to undeclared variables
// throw. Moved into this sloppy script, they would create globals instead.
try {
    class C {
        static set(x) {
            C.value = x;
        }
        static cache = (missingA = 1);
    }
} catch (e) {
    console.log(e.name);
}

let assign;
class D {
    static set(x) {
        D.value = x;
    }
    static cache = (assign = () => {
        missingB = 1;
    });
}
try {
    assign();
} catch (e) {
    console.log(e.name);
}

let update;
class E {
    static set(x) {
        E.value = x;
    }
    static cache = (update = () => {
        missingC++;
    });
}
try {
    update();
} catch (e) {
    console.log(e.name);
}

console.log(typeof missingA, typeof missingB, typeof missingC);

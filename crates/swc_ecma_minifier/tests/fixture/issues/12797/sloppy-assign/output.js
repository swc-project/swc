let assign, update, loop;
// The class body is strict, so these assignments to undeclared variables
// throw. Moved into this sloppy script, they would create globals instead.
try {
    class C {
        static set(x) {
            C.value = x;
        }
        static cache = missingA = 1;
    }
} catch (e) {
    console.log(e.name);
}
class D {
    static set(x) {
        D.value = x;
    }
    static cache = assign = ()=>{
        missingB = 1;
    };
}
try {
    assign();
} catch (e) {
    console.log(e.name);
}
class E {
    static set(x) {
        E.value = x;
    }
    static cache = update = ()=>{
        missingC++;
    };
}
try {
    update();
} catch (e) {
    console.log(e.name);
}
// A property write on a primitive throws only in strict code.
try {
    class F {
        static set(x) {
            F.value = x;
        }
        static cache = "x".p = console.log("init F");
    }
} catch (e) {
    console.log(e.name);
}
class G {
    static set(x) {
        G.value = x;
    }
    static cache = loop = ()=>{
        for (missingD of [
            1
        ]);
        for(missingE in {
            a: 1
        });
    };
}
try {
    loop();
} catch (e) {
    console.log(e.name);
}
// `delete` of a non-configurable property throws only in strict code.
try {
    class H {
        static set(x) {
            H.value = x;
        }
        static cache = (console.log("init H"), delete Object.prototype);
    }
} catch (e) {
    console.log(e.name);
}
console.log("init I"), console.log(typeof missingA, typeof missingB, typeof missingC, typeof missingD, typeof missingE);

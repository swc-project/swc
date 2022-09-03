//// [computedPropertyNames11_ES6.ts]
var s, n, a, v1 = {
    get [s] () {
        return 0;
    },
    set [n] (v){},
    get [s + s] () {
        return 0;
    },
    set [s + n] (v){},
    get [+s] () {
        return 0;
    },
    set "" (v){},
    get 0 () {
        return 0;
    },
    set [a] (v){},
    get [!0] () {
        return 0;
    },
    set "hello bye" (v){},
    get [`hello ${a} bye`] () {
        return 0;
    }
};

"AAAAAAAA";
"BBBBBBB";
new (class {
    f(A) {
        try {
            throw { m: "PASS" };
        } catch ({ m: B }) {
            console.log(B);
        }
    }
})().f();

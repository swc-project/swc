"AAAAAAAA";
"BBBBBBB";
new class {
    f(A) {
        try {
            throw {
                m: "PASS"
            };
        } catch ({ m: A }) {
            console.log(A);
        }
    }
}().f();

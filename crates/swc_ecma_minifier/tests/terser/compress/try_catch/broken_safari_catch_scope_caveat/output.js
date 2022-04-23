"AAAAAAAA";
"BBBBBBB";
new class {
    f(b) {
        try {
            throw {
                m: "PASS"
            };
        } catch ({ m: a  }) {
            console.log(a);
        }
    }
}().f();

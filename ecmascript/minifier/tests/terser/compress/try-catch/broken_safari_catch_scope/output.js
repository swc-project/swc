"AAAAAAAA";
"BBBBBBB";
new class {
    f(a) {
        try {
            throw {
                m: "PASS"
            };
        } catch ({ m: a  }) {
            console.log(a);
        }
    }
}().f();

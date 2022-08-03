"AAAAAAAA";
"BBBBBBB";
new (class {
    f(c) {
        try {
            throw {
                m: "PASS"
            };
        } catch ({ m: t  }) {
            console.log(t);
        }
    }
})().f();

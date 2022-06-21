"AAAAAAAA";
"BBBBBBB";
new (class {
    f(a) {
        try {
            throw {
                m: "PASS"
            };
        } catch ({ m: b  }) {
            console.log(b);
        }
    }
})().f();

"AAAAAAAA";
"BBBBBBB";
new (class {
    f(x) {
        try {
            throw { m: "PASS" };
        } catch ({ m: s }) {
            console.log(s);
        }
    }
})().f();

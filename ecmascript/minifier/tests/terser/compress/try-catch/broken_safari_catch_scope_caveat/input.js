"AAAAAAAA";
"BBBBBBB";
new (class {
    f(x) {
        try {
            throw { m: "PASS" };
        } catch ({ m: x }) {
            console.log(x);
        }
    }
})().f();

console.log({
    *gen (a) {
        return yield a.toUpperCase(), 2;
    }
}.gen("pass").next().value);

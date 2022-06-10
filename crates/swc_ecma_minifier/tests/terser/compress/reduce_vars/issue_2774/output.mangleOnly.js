console.log({
    get a () {
        var a;
        (a = true) && a.c;
        a = void 0;
    }
}.a);

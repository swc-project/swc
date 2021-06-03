function f(a) {
    l: {
        if (a) break l;
        var t = 1;
    }
    console.log(t);
}

f(123123)
f(0)
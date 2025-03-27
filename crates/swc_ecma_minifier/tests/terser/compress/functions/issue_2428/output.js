function baz(a) {
    r: {
        console.log(a);
        break r;
    }
}
baz(42);
baz("PASS");

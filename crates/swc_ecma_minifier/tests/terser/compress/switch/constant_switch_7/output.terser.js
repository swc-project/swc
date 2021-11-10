OUT: {
    foo();
    x();
    if (foo) break OUT;
    for (var x = 0; x < 10; x++) {
        if (x > 5) break;
        console.log(x);
    }
    y();
    bar();
}

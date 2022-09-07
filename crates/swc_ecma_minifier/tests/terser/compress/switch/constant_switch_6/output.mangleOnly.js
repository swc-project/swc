a: {
    foo();
    switch (1) {
        case 1:
            x();
            if (foo) break a;
            y();
        case 1 + 1:
            bar();
            break;
        default:
            def();
    }
}

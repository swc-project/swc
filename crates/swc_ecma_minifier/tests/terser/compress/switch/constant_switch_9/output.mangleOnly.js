a: switch (1) {
    case 1:
        x();
        for (;;) if (foo) break a;
        y();
    case 1 + 1:
        bar();
    default:
        def();
}

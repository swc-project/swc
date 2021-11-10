OUT: switch (1) {
    case 1:
        x();
        for (;;) if (foo) break OUT;
        y();
    case 1 + 1:
        bar();
    default:
        def();
}

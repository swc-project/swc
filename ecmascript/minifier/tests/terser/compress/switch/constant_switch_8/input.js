OUT: switch (1) {
    case 1:
        x();
        for (;;) break OUT;
        y();
        break;
    case 1 + 1:
        bar();
    default:
        def();
}

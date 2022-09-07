a: switch (1) {
    case 1:
        x();
        for (;;) break a;
        y();
        break;
    case 1 + 1:
        bar();
    default:
        def();
}

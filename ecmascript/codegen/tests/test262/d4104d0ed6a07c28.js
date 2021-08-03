// Do not mangle to the same name
e: {
    d: {
        a("b");
        if (c) {
            break d;
        }
        break e;
    }
}

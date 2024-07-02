class Test {
    /* 1.1 L id */ prop /* 1.2 T id */; /* 1.3 T prop */

    /* 2.1 L prop */ declare /* 2.2 L prop */ static /* 2.3 L variance */ + /* 2.4 L id */ prop /* 2.5 T id */; /* 2.6 T prop */

    /* 3.1 L private prop */ declare /* 3.2 L private prop */ static /* 3.3 L variance */ + /* 3.4 L private */ #private1 /* 3.5 T id */; /* 3.6 T private prop */

    /* 4.1 L id */ prop /* 4.2 T id */ = /* 4.3 L num */ 1 /* 4.4 T num */; /* 4.5 T prop */

    /* 5.1 L private */ #private2 /* 5.2 T id */ = /* 5.3 L num */ 1 /* 5.4 T num */; /* 5.5 T private prop */

    /* 6.1 L computed */ [prop] /* 6.2 T computed */ = /* 6.3 L num */ 1 /* 6.4 T num */; /* 6.5 T prop */
}

class Test {
    /* 7.1 L computed */ [prop] /* 7.2 T computed */

    /* 7.3 L id */ prop /* 7.4 T id */

    /* 7.5 L private */ #prop /* 7.6 T id */

    /* 7.7 L str */ "prop" /* 7.8 T str */

    /* 7.9 L id */ prop: any /* 7.10 T any */

    /* 7.11 L id */ prop = 1 /* 7.12 T num */

    /* 7.13 L id */ prop /* 7.14 T id */

    /* 7.15 T id */
}

class Test {
    prop; /* 8.1 L id */ prop; /* 8.2 T prop */

    /* 8.3 T prop */
}

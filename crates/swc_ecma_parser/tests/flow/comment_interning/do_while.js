function only_leading () {
    // 1.0. unreachable leading comment
    var i = 0;  // 1.1. trailing var decl
    // 1.2. leading comment
    do {
        i += 1;
    } while (i < 3);
}

function leading_n_trailing() {
    var i = 0;
    // 2.1. leading comment
    do {
        i += 1;
    } while (i < 3) /* 2.2. trailing comment */;

    // 2.3. trailing comment
}

function only_trailing() {
    var i = 0;
    do {
        i += 1;
    } /* 3.0. pre-keyword trailing comment */ while /* 3.1. pre-cond trailing comment */ (i< 3) /* 3.2. past-cond trailing comment */; /* 3.3 past semicolon trailing */

    // 3.4. trailing comment
}

function implicit_semicolon() {
    do {} while (true) /* 4.1 Trailing */
    /* 4.2 Leading */ do {} while (true) /* 4.3 Trailing */
}

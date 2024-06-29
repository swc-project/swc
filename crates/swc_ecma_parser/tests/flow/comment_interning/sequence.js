function parenthesizedSequence() {
    /* 1.1 Leading seq */ (1, 1) /* 1.2 Trailing seq */;
}

function unparenthesizedSequence() {
    /* 2.1 Leading num */ 1, 1 /* 2.2 Trailing num */;
}

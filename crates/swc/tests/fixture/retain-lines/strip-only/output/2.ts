class C extends Array /**/  {
    //          ^^^^^                      ^^^     ^^^^^^^^^^^^^^
    field = "";

    static accessor f1;
    f2;
    //  ^^^^^^^       ^    ^^^^^^^^

    method(/**/ a/**/ ) /*︎*/ {
    //            ^^^         ^^^^^^^^      ^     ^^^^^^^^         ^^^^^^
    }
}

class C /**/<T>/*︎*/ extends Array/**/<T> /*︎*/ implements I, J/*︎*/ {
    //          ^^^^^                      ^^^     ^^^^^^^^^^^^^^
    readonly field/**/: string/**/ = "";
    //  ^^^^^^^^          ^^^^^^^^
    static accessor f1;
    private f2/**/!/**/: string/*︎*/;
    //  ^^^^^^^       ^    ^^^^^^^^

    method/**/<T>/*︎*/(/*︎*/this: T,/**/ a? /*︎*/: string/**/)/*︎*/: void/*︎*/ {
        //            ^^^         ^^^^^^^^      ^     ^^^^^^^^         ^^^^^^
    }
}
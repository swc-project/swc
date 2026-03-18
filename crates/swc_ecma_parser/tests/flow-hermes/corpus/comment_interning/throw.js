function test() {
    // 1.1 Not a leading comment
    var F = function(){};
    // 1.2 Leading comment
    /* 1.3 Leading comment */ throw /* 1.4 Not a trailing comment */ new Error('Error') /* 1.5 Trailing new args */;
}

/* 2.1 L throw */ throw new Error('') /* 2.2 T args */ ; /* 2.3 T throw */

{
    /* 3.1 L throw */ throw new Error('') /* 3.2 T args */
    /* 3.3 L throw */ throw new Error('')
    /* 3.4 T args */
}

/*pre: 1*/ test();
test(123/*post: 3*/ );
test(/*pre: 4*/ 123);
test(/*pre: 5*/ 123/*post: 6*/ );
test(/*pre: 7*/ 123, /*pre: 8*/ 456);
test(123/*post: 9*/ , 456/*post: 10*/ );

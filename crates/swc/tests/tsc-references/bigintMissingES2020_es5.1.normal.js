// @target: es2020
// @lib: dom,es2017
test();
test(); // should have global error when bigint is used but ES2020 lib is not present

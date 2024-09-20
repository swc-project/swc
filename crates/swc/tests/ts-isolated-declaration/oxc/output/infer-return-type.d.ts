declare function foo();
// inferred type is number
declare function bar();
// inferred type is number | undefined
declare function baz();
// We can't infer return type if there are multiple return statements with different types
declare function qux();

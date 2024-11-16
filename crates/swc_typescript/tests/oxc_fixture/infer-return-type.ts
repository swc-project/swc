function foo() {
   return 1;
}
// inferred type is number

function bar() {
  if (a) {
   return;
  }
  return 1;
}
// inferred type is number | undefined

function baz() {
 if (a) {
  return null;
 }
 return 1;
}
// We can't infer return type if there are multiple return statements with different types

function qux() {
  const a = (() => {
    return 1;
  })();
  return `Hello, world!`;
}

function quux() {
  return `${''}`
}
// Inferred type is string

function returnFunctionOrNothing() {
  if (process.env.NODE_ENV === 'development') {
    return
  }

  return () => 0;
}
// Basic parameter inlining - undefined parameter
function complex(foo) {
  const fn = undefined;
  if (Math.random() > 0.5) throw new Error();
  return fn?.(foo);
}

console.log(complex("foo"));
console.log(complex("bar"));
console.log(complex("baz"));

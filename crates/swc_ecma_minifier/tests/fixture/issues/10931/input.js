function complex(foo, fn) {
  // prevent inlining
  if (Math.random() > 0.5) throw new Error()
  return fn?.(foo)
}

console.log(complex("foo"))
console.log(complex("bar"))
console.log(complex("baz"))

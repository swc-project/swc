let depth = 0;

function foo(n) {
  depth += 1;
  let k = visit(n);
  depth -= 1;
  return k;
}

blackbox(foo);

function component(a) {
  let x;
  if (a) {
    x = "bar";
  } else {
    x = "baz";
  }

  const y = x;
  mutate(y);
  return y;
}

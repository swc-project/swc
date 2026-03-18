const e = match (x) {
  foo.bar: true,
  foo[1]: true,
  foo["bar"]: true,
  foo.bar[1]: true,
  foo[1].bar["baz"]: true,
};

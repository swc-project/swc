function component() {
  const x = {};
  const p = {};
  const q = {};
  const y = {};

  x.y = y;
  p.y = x.y;
  q.y = p.y;

  mutate(q);
}

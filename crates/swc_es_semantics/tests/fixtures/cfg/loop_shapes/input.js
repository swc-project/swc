function loops(n) {
  let i = 0;

  while (i < n) {
    if (i > 5) break;
    i = i + 1;
  }

  do {
    i = i - 1;
    if (i === 2) continue;
  } while (i > 0);

  return i;
}

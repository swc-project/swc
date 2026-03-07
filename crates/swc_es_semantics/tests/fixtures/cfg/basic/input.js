function loop(n) {
  let s = 0;
  for (let i = 0; i < n; i = i + 1) {
    if (i === 2) continue;
    if (i === 5) break;
    s = s + i;
  }
  return s;
}

loop(10);

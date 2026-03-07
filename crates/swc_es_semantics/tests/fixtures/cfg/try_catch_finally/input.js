function tc(x) {
  try {
    if (x) throw x;
    x = x + 1;
  } catch (e) {
    x = e;
  } finally {
    x = x + 2;
  }

  return x;
}

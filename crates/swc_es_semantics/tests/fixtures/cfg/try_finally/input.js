function test(x) {
  try {
    if (x) {
      return 1;
    }
    throw x;
  } catch (e) {
    return 2;
  } finally {
    x = x + 1;
  }
}

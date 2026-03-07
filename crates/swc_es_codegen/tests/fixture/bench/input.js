const table = { __spread__: base, a: 1, b: 2, c: 3 };
function compute(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item && item.enabled) {
      total += item.value ?? 0;
    }
  }
  return total;
}
class Worker {
  static {
    init();
  }
  run(items) {
    return compute(items.map((item) => item.value + 1));
  }
}
export { compute, Worker, table };

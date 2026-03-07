let total = 1 + 2 * 3;
const list = [first, , ...rest];
if (flag) {
  total += list[0] ?? 0;
} else if (other) total--;
for (let i = 0; i < 3; i++) total += i;
while (total > 0) total--;
do total++; while (total < 2);
switch (kind) {
  case "a":
    total += 1;
    break;
  default:
    total = 0;
}
try {
  work();
} catch (err) {
  handle(err);
} finally {
  done();
}
function add(a, b) {
  return a + b;
}
class Box extends Base {
  static count = 0;
  value = 1;

  constructor(v) {
    this.value = v;
  }

  get current() {
    return this.value;
  }

  set current(next) {
    this.value = next;
  }

  static {
    this.count++;
  }
}
({ key: total }).key;
new Box(1).current;
value?.[index];
